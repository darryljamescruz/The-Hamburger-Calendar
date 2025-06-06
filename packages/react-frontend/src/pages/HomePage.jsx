import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="font-inter">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">The Hamburger Calendar</span>
                    <img
                        alt="Hamburger Logo"
                        src="/hamburger.png"
                        className="h-8 w-auto"
                    />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="/login" className="text-sm font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">The Hamburger Calendar</span>
                        <img
                        alt="Hamburger Logo"
                        src="/hamburger.png"
                        className="h-8 w-auto"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                    </div>
                    <div className="mt-6">
                    <a
                        href="/login"
                        className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                        Log in
                    </a>
                    </div>
                </DialogPanel>
                </Dialog>
            </header>

            {/* Dual Pane Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
              <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-slate-800 opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>
              {/* Dual pane grid */}
              <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-32 sm:py-48 lg:py-56 px-6 lg:px-8">
                {/* Left: Hero */}
                <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-xl text-center md:text-left">
                  <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                    The Hamburger Calendar
                  </h1>
                  <p className="mt-8 text-lg font-medium text-gray-600">
                    Built for students, organizers, and planners — streamline your scheduling needs. Create events, track academic and personal tasks, and customize your calendar. Designed by a Cal Poly students takinng Software Engineering I and II during Winter/Spring 2025.
                  </p>
                  <div className="mt-10 flex justify-center md:justify-start">
                    <a
                      href="/login"
                      className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Try it now
                    </a>
                  </div>
                </div>
                {/* Right: Screenshot */}
                <div className="flex justify-center">
                  <img
                    src="/month.png"
                    alt="Month View"
                    className="rounded-xl shadow-2xl max-w-full"
                  />
                </div>
              </div>
              <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-slate-800 opacity-25 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
              </div>
            </div>

            {/* Screenshot Section */}
            <div className="mx-auto max-w-6xl px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <img
                  src="/month.png"
                  alt="Month View"
                  className="w-full rounded-lg shadow-xl object-cover"
                />
                <p className="mt-2 text-center text-sm text-gray-600">Month View</p>
              </div>
              <div>
                <img
                  src="/week.png"
                  alt="Week View"
                  className="w-full rounded-lg shadow-xl object-cover"
                />
                <p className="mt-2 text-center text-sm text-gray-600">Week View</p>
              </div>
              <div>
                <img
                  src="/day.png"
                  alt="Day View"
                  className="w-full rounded-lg shadow-xl object-cover"
                />
                <p className="mt-2 text-center text-sm text-gray-600">Day View</p>
              </div>
            </div>

            
            <footer className="mt-10 py-6 text-center text-sm text-gray-600 border-t border-gray-300">
                Created by Alex Sahli, Matthew Suban, Darryl James Cruz, and Stephen Chen for Software Engineering I/II at California Polytechnic State University – San Luis Obispo
            </footer>
        </div>
  )
}