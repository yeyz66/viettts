'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      quote: t('testimonial1.quote'),
      author: t('testimonial1.author'),
      role: t('testimonial1.role'),
      avatar: '/avatars/avatar-1.png',
    },
    {
      quote: t('testimonial2.quote'),
      author: t('testimonial2.author'),
      role: t('testimonial2.role'),
      avatar: '/avatars/avatar-2.png',
    },
    {
      quote: t('testimonial3.quote'),
      author: t('testimonial3.author'),
      role: t('testimonial3.role'),
      avatar: '/avatars/avatar-3.png',
    },
  ];

  function createAvatar(name: string, index: number) {
    // Generate an avatar using DiceBear API
    const styles = ['initials', 'avataaars', 'bottts', 'pixel-art'];
    const style = styles[index % styles.length];
    const seed = encodeURIComponent(name);
    
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=6366f1,8b5cf6,ec4899`;
  }

  // Track avatar loading errors
  const [avatarErrors, setAvatarErrors] = useState<{[key: number]: boolean}>({});
  
  const handleImageError = (index: number) => {
    setAvatarErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
        </div>
        <motion.div 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col justify-between rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-x-2 text-indigo-600 dark:text-indigo-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <Image 
                  className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700"
                  src={avatarErrors[index] ? createAvatar(testimonial.author, index) : testimonial.avatar}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  onError={() => handleImageError(index)}
                  unoptimized={avatarErrors[index]} // Skip image optimization for external URLs
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 