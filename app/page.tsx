import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Star, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-b from-pink-50/50 to-white overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />

        <div className="container px-4 relative z-10 text-center flex flex-col items-center gap-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-pink-100 text-pink-600 text-sm font-medium tracking-wide animate-fade-in-up shadow-sm">
            ✨ WELCOME TO TANATSWA'S HUB
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-none max-w-5xl">
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Journey</span> to Success
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Guidance, mentorship, and resources for every stage of your student life.
            Built for the girl who wants to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/programs" className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:scale-105 hover:shadow-pink-300/50 transition-all flex items-center gap-2 shadow-xl shadow-pink-200">
              Start Your Mentorship <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 ring-8 ring-white">
          {/* Placeholder for Tanatswa's image */}
          <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center text-gray-400 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center">

          </div>
        </div>
        <div className="order-1 md:order-2 flex flex-col gap-6">
          <h2 className="text-4xl font-bold text-gray-900">About Me</h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              Hi! I'm Tanatswa. I created this hub to be the big sister I wish I had.
              Whether you are navigating high school exams, preparing for university, or taking a gap year,
              I'm here to share resources and faith-based mentorship to help you thrive.
            </p>
            <p>
              My mission is to equip young people with practical learning resources and personal development guidance in a space that feels like home.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="container px-4 mx-auto py-12">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
          <p className="text-gray-500 max-w-lg">Curated resources specifically designed for the season you are in right now.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProgramCard
            title="High School"
            icon={<BookOpen className="w-8 h-8 text-pink-500" />}
            description="Ace your exams and navigate teen life with confidence."
            href="/programs/high-school"
          />
          <ProgramCard
            title="University"
            icon={<GraduationCap className="w-8 h-8 text-purple-500" />}
            description="Thrive in your degree, campus life, and beyond."
            href="/programs/university"
          />
          <ProgramCard
            title="Gap Year"
            icon={<User className="w-8 h-8 text-orange-500" />}
            description="Make the most of your time off to discover yourself."
            href="/programs/gap-year"
          />
          <ProgramCard
            title="Personal Dev"
            icon={<Star className="w-8 h-8 text-yellow-500" />}
            description="Grow in faith, character, leadership and life skills."
            href="/programs/personal-development"
          />
        </div>
      </section>
    </div>
  );
}

function ProgramCard({ title, icon, description, href }: { title: string, icon: React.ReactNode, description: string, href: string }) {
  return (
    <Link href={href} className="group p-8 rounded-[2rem] bg-white border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col gap-6 text-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 group-hover:rotate-6 transition-all duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}
