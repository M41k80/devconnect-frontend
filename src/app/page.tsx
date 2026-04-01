'use client'

import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { HeroSection } from '@/app/components/landing/HeroSection'
import { Stats } from '@/app/components/landing/Stats'
import { Features } from '@/app/components/landing/Features'
import { CTABanner } from '@/app/components/landing/CTABanner'

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
      <HeroSection />
      <Stats />
      <Features />
      <CTABanner />
      <Footer />
    </div>
  )
}