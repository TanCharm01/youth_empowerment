import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Star, User, Mic, Play } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function Home() {
  const programs = await prisma.programs.findMany();

  // Helper to find ID by title
  const getLink = (title: string) => {
    const p = programs.find(program => program.title === title);
    return p ? `/programs/${p.id}` : '/programs';
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
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
      <section className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center py-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-bold text-gray-900 border-l-4 border-pink-500 pl-4">About Me</h2>
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

        <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 ring-8 ring-white bg-gray-100">
          {/* Placeholder for Tanatswa's image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
      </section>

      {/* Programs Section */}
      {/* Mentorship Section */}
      <section className="container px-4 mx-auto py-12 pb-24">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Left Column: Mission + CTA */}
          <div className="md:col-span-5 flex flex-col justify-center gap-8">
            <div>
              <span className="text-pink-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Mentorship</span>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Success,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">My Mission.</span>
              </h2>
            </div>

            <div className="h-1 w-20 bg-pink-500 rounded-full" />

            <p className="text-gray-600 text-lg">
              Choose the path that fits your current season. From high school prep to personal growth, we have a roadmap for you.
            </p>

            <div>
              <Link href="/programs" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Grid */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProgramCard
                title="High School"
                icon={<BookOpen className="w-6 h-6 text-pink-500" />}
                description="Ace your exams & naviagte teen life."
                href={getLink("High School")}
              />
              <ProgramCard
                title="University"
                icon={<GraduationCap className="w-6 h-6 text-purple-500" />}
                description="Thrive in your degree & campus life."
                href={getLink("University")}
              />
              <ProgramCard
                title="Gap Year"
                icon={<User className="w-6 h-6 text-orange-500" />}
                description="Discover yourself before your next step."
                href={getLink("Gap Year")}
              />
              <ProgramCard
                title="Personal Dev"
                icon={<Star className="w-6 h-6 text-yellow-500" />}
                description="Grow in faith, character & leadership."
                href={getLink("Personal Dev")}
              />
            </div>
          </div>
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
