'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Info, ChevronDown } from 'lucide-react'
import { bookSchema, type BookFormData } from '@/lib/validations/book'
import { BookImageUpload } from '@/components/books/BookImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const CONDITIONS = [
  { value: 'like_new', label: '🌟 Like New', desc: 'Barely used, no marks or damage' },
  { value: 'good', label: '✅ Good', desc: 'Minor wear, all pages intact' },
  { value: 'fair', label: '📗 Fair', desc: 'Noticeable wear, no missing pages' },
  { value: 'acceptable', label: '📄 Acceptable', desc: 'Heavy wear, readable but worn' },
]
const CATEGORIES = [
  { id: 1, name: 'Fiction' },{ id: 2, name: 'Non-Fiction' },{ id: 3, name: 'Science & Technology' },
  { id: 4, name: 'History' },{ id: 5, name: 'Biography' },{ id: 6, name: 'Self Help' },
  { id: 7, name: 'Children' },{ id: 8, name: 'Comics & Manga' },{ id: 9, name: 'Academic' },
  { id: 10, name: 'Religion & Spirituality' },{ id: 11, name: 'Business' },{ id: 12, name: 'Arts & Photography' },
]
const PROVINCES = [
  'Koshi Province', 'Madhesh Province', 'Bagmati Province',
  'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province'
]
const DELIVERY_OPTIONS = [
  { value: 'pickup', label: '🤝 Local Pickup Only', desc: 'Buyer collects from you' },
  { value: 'shipping', label: '📦 Ship Only', desc: "You'll ship to the buyer" },
  { value: 'both', label: '✨ Both Options', desc: 'Buyer chooses what works' },
]

export default function SellPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const supabase = createClient()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { language: 'English', delivery_type: 'both' },
  })

  const askingPrice = watch('asking_price')
  const originalPrice = watch('original_price')
  const discount = originalPrice && askingPrice && originalPrice > askingPrice
    ? Math.round((1 - askingPrice / originalPrice) * 100) : null

  const onSubmit = async (data: BookFormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please login to list a book'); return }

    try {
      // Upload images
      const uploadedUrls: string[] = []
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('book-images').upload(path, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('book-images').getPublicUrl(path)
          uploadedUrls.push(publicUrl)
        }
      }

      const { data: book, error } = await supabase.from('books').insert({
        seller_id: user.id,
        title: data.title, author: data.author, description: data.description,
        category_id: parseInt(data.category_id), language: data.language,
        original_price: data.original_price, asking_price: data.asking_price,
        condition: data.condition, edition: data.edition, publisher: data.publisher,
        year_published: data.year_published, pages: data.pages,
        city: data.city, state: data.state, delivery_type: data.delivery_type,
        images: uploadedUrls, cover_image: uploadedUrls[0] || null,
      }).select().single()

      if (error) throw error
      toast.success('Book listed successfully!')
      window.location.href = `/books/${book.id}`
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    }
  }

  const sel = `w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 text-stone-800 bg-white outline-none transition-colors appearance-none`

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center">
            <BookOpen size={20} color="white" />
          </div>
          <h1 className="serif text-3xl font-bold text-stone-900">List a Book</h1>
        </div>
        <p className="text-stone-500">Buyers contact you directly — no checkout, no fees</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Photos */}
        <section className="bg-white rounded-2xl border border-stone-100 p-6">
          <h2 className="font-semibold text-stone-800 text-lg mb-1">Book Photos</h2>
          <p className="text-stone-400 text-sm mb-5">Up to 6 photos. Cover + spine + pages = more trust!</p>
          <BookImageUpload images={imageFiles} previews={imagePreviews}
            onChange={(files, previews) => { setImageFiles(files); setImagePreviews(previews) }} />
        </section>

        {/* Book Details */}
        <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="font-semibold text-stone-800 text-lg">Book Details</h2>
          <Input {...register('title')} label="Book Title" required placeholder="e.g. Atomic Habits" error={errors.title?.message} />
          <Input {...register('author')} label="Author" required placeholder="e.g. James Clear" error={errors.author?.message} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select {...register('category_id')} className={`${sel} pr-10`}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Language</label>
              <div className="relative">
                <select {...register('language')} className={`${sel} pr-10`}>
                  {['English','Nepali','Maithili','Bhojpuri','Tharu','Tamang','Newari','Magar','Other'].map((l) => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description <span className="font-normal text-stone-400">(optional)</span></label>
            <textarea {...register('description')} rows={3}
              placeholder="Notes on condition, highlights, why you're selling..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 text-stone-800 bg-white outline-none transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input {...register('publisher')} label="Publisher" placeholder="Penguin" />
            <Input {...register('edition')} label="Edition" placeholder="2nd Ed." />
            <Input {...register('year_published')} label="Year" type="number" placeholder="2023" />
          </div>
        </section>

        {/* Condition */}
        <section className="bg-white rounded-2xl border border-stone-100 p-6">
          <h2 className="font-semibold text-stone-800 text-lg mb-5">Book Condition <span className="text-red-500">*</span></h2>
          <div className="grid grid-cols-2 gap-3">
            {CONDITIONS.map((c) => (
              <label key={c.value} className="cursor-pointer">
                <input type="radio" {...register('condition')} value={c.value} className="peer hidden" />
                <div className="border-2 border-stone-100 rounded-xl p-4 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-all hover:border-stone-300">
                  <div className="font-semibold text-stone-800 text-sm mb-1">{c.label}</div>
                  <div className="text-stone-400 text-xs">{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.condition && <p className="text-red-500 text-xs mt-2">{errors.condition.message}</p>}
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-stone-800 text-lg mb-1">Asking Price</h2>
            <p className="text-stone-400 text-sm">Your starting price — buyers may negotiate via chat</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input {...register('original_price')} label="Original MRP" hint="optional" type="number" placeholder="900" prefix="Rs." error={errors.original_price?.message} />
            <Input {...register('asking_price')} label="Asking Price" required type="number" placeholder="350" prefix="Rs." error={errors.asking_price?.message} />
          </div>
          {discount !== null && discount > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm">
              <Info size={16} /> Buyers save <strong>{discount}%</strong> from MRP — great value attracts more messages!
            </div>
          )}
          <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800 flex gap-2">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span>Payment is handled directly between you and the buyer — cash, eSewa, Khalti, or whatever you both agree on. Bechne doesn't process any money.</span>
          </div>
        </section>

        {/* Location & Delivery */}
        <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-stone-800 text-lg mb-1">Location & Delivery</h2>
            <p className="text-stone-400 text-sm">Helps buyers nearby find you</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input {...register('city')} label="City" required placeholder="Kathmandu" error={errors.city?.message} />
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Province <span className="text-red-500">*</span></label>
              <div className="relative">
                <select {...register('state')} className={`${sel} pr-10`}>
                  <option value="">Select province</option>
                  {PROVINCES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">How can buyers get the book? <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label key={opt.value} className="cursor-pointer flex items-start gap-3 p-4 border-2 border-stone-100 rounded-xl hover:border-stone-200 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 transition-all">
                  <input type="radio" {...register('delivery_type')} value={opt.value} className="mt-0.5 accent-amber-700" />
                  <div>
                    <div className="font-semibold text-stone-800 text-sm">{opt.label}</div>
                    <div className="text-stone-400 text-xs mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-stone-800">Ready to list?</div>
            <div className="text-stone-500 text-sm">Buyers will message you directly</div>
          </div>
          <Button type="submit" size="lg" loading={isSubmitting}>
            List Book →
          </Button>
        </div>
      </form>
    </div>
  )
}