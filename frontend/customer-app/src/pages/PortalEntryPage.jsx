import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const portals = [
  {
    title: 'Customer',
    desc: 'Manage appointments and favourites.',
    to: '/login',
    local: true,
  },
  {
    title: 'Salon Owner',
    desc: 'Run your salon day with clarity.',
    to: 'http://localhost:5174/login',
  },
  {
    title: 'Staff',
    desc: 'View your schedule and clients.',
    to: 'http://localhost:5175/login',
  },
  {
    title: 'Admin',
    desc: 'Monitor the Elaris marketplace.',
    to: 'http://localhost:5176/login',
  },
];

export default function PortalEntryPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-9 px-5 py-12 lg:grid-cols-[.8fr_1.2fr] lg:py-20 rise">
      <div className="rounded-[2rem] bg-[#29231f] p-8 text-white sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#dcb789]">Elaris access</p>
        <h1 className="serif mt-5 text-[2rem] leading-tight">One platform for every beauty moment.</h1>
        <p className="mt-6 max-w-sm leading-7 text-[#e0d4c7]">
          Choose the Elaris space designed for you—whether you are booking your next ritual, managing a salon, or guiding the marketplace.
        </p>
        <Link to="/" className="mt-10 inline-block text-sm font-semibold text-[#dcb789]">← Return to Elaris</Link>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold text-[#a16e45]">Choose your experience</p>
        <h2 className="serif mt-2 text-3xl">Where would you like to go?</h2>
        <div className="mt-7 grid gap-4">
          {portals.map((portal) =>
            portal.local ? (
              <Link key={portal.title} to={portal.to} className="choice flex items-center justify-between no-underline text-inherit">
                <span>
                  <b className="block">{portal.title}</b>
                  <span className="mt-1 block text-sm text-[#746a61]">{portal.desc}</span>
                </span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <a key={portal.title} href={portal.to} className="choice flex items-center justify-between no-underline text-inherit">
                <span>
                  <b className="block">{portal.title}</b>
                  <span className="mt-1 block text-sm text-[#746a61]">{portal.desc}</span>
                </span>
                <ArrowRight size={18} />
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}
