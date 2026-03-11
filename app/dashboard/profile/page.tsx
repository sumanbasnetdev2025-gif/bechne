export const dynamic = 'force-dynamic'
'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Camera } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Enter your name'),
  username: z.string().min(3, 'Min 3 characters').optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().max(300).optional(),
})
type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) reset({
      full_name: profile.full_name || '',
      username: profile.username || '',
      phone: profile.phone || '',
      city: profile.city || '',
      state: profile.state || '',
      bio: profile.bio || '',
    })
  }, [profile])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return
    const { error } = await supabase.from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) toast.error(error.message)
    else toast.success('Profile updated!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>Edit Profile</h1>
        <p className="text-stone-500 text-sm">Buyers trust sellers with complete profiles</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-white rounded-2xl border border-stone-100">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xl">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(profile?.full_name)
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 bg-amber-800 text-white rounded-full p-1.5 cursor-pointer hover:bg-amber-900 transition-colors">
            <Camera size={12} />
            <input type="file" accept="image/*" className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file || !user) return
                const path = `${user.id}/avatar.${file.name.split('.').pop()}`
                const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
                if (!error) {
                  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
                  await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
                  toast.success('Avatar updated!')
                }
              }} />
          </label>
        </div>
        <div>
          <div className="font-semibold text-stone-800">{profile?.full_name || 'Your Name'}</div>
          <div className="text-stone-400 text-sm">{user?.email}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Input {...register('full_name')} label="Full Name" required placeholder="Priya Sharma" error={errors.full_name?.message} />
          <Input {...register('username')} label="Username" placeholder="priya_reads" hint="optional" error={errors.username?.message} />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Input {...register('phone')} label="Phone Number" placeholder="+91 98765 43210" hint="shown only in chat" />
          <Input {...register('city')} label="City" placeholder="Kathmandu" />
        </div>
        <Input {...register('state')} label="Province" placeholder="Bagmati Province" />
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">Bio <span className="font-normal text-stone-400">(optional)</span></label>
          <textarea {...register('bio')} rows={3}
            placeholder="Tell buyers a little about yourself as a reader and seller..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 text-stone-800 bg-white outline-none transition-colors resize-none text-sm" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}