import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mic, Handshake, Globe, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="font-sans text-gray-800">

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 px-10 py-5 flex justify-between items-center transition-all duration-300
        ${scrolled ? "bg-[#0B1F3A]/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}>

        <img src="/logo.png" className="h-10 cursor-pointer hover:scale-105 transition"
          onClick={() => scrollTo("home")} alt="Logo" />

        <div className="hidden md:flex items-center gap-10 text-white text-sm tracking-wide">
          {["Home","Our Story","Community","Spotlight","Events"].map((item,i)=>(
            <button key={i}
              onClick={()=>scrollTo(["home","story","network","spotlight","testimonials"][i])}
              className={`relative ${i===0?"text-[#F5B400]":""}`}>
              {item}
              <span className="absolute left-0 -bottom-2 w-0 h-[2px] bg-[#F5B400] transition-all duration-300 hover:w-full"></span>
            </button>
          ))}

          <button onClick={handleLogin}
            className="bg-[#123A6F] px-6 py-2 rounded-lg hover:bg-[#0F2F5A] transition shadow">
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home"
        className="h-screen bg-cover bg-center relative flex items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/hero.jpg')" }}>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-xs tracking-[0.3em] text-gray-300 mb-3">
            CHITKARA HAPPINESS CENTER
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            ALUMNI NETWORK
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Connected by memories,<br />
            growing through journeys.
          </p>

          <button onClick={handleLogin}
            className="bg-[#123A6F] px-7 py-3 rounded-lg text-lg hover:scale-105 transition shadow-lg">
            Reconnect →
          </button>
        </div>

        {/* SCROLL */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white opacity-80">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
          <p className="text-xs mt-2 tracking-widest text-gray-300">SCROLL</p>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="py-24 px-10 bg-white">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <div>
            <p className="text-[#F5B400] text-sm font-bold tracking-wider mb-3 uppercase">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-[#0B1F3A]">
              More Than a Place,<br />It’s a Feeling.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              The Happiness Center was never just a place—it was a feeling.<br/>
              A space where we learned, laughed, supported each other and grew together.<br/>
              This network is our way of keeping that connection alive, forever.
            </p>
            <button className="bg-[#0B1F3A] text-white px-8 py-3 rounded font-medium hover:bg-[#123A6F] transition shadow">
              Know More About Us
            </button>
          </div>

          <div className="relative">
            <img src="/landing image.jpeg" alt="The Happiness Center Group"
              className="rounded-3xl shadow-xl hover:scale-105 transition duration-500 object-cover w-full h-auto"/>
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section id="network" className="py-24 px-10 bg-[#F8F9FB] text-center">
        <p className="text-[#F5B400] text-sm font-bold tracking-wider mb-2 uppercase">Stay Connected</p>
        <h2 className="text-4xl font-extrabold mb-16 text-[#0B1F3A]">What You Can Do</h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Share Your Journey",
              text: "Alumni can share their experiences, lessons, and life after college.",
              icon: <Users size={24} className="text-yellow-500" />,
              bg: "bg-yellow-50"
            },
            {
              title: "Host Sessions",
              text: "Conduct interactive sessions, talks, and workshops for students.",
              icon: <Mic size={24} className="text-blue-500" />,
              bg: "bg-blue-50"
            },
            {
              title: "Mentor & Get Mentored",
              text: "Alumni can guide students, and students can choose mentors that fit their goals.",
              icon: <Handshake size={24} className="text-green-500" />,
              bg: "bg-green-50"
            },
            {
              title: "Revive the Bond",
              text: "Join online meetups and reconnect with the Happiness Center community.",
              icon: <Globe size={24} className="text-purple-500" />,
              bg: "bg-purple-50"
            }
          ].map((item, i) => (
            <div key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex flex-col items-center text-center">

              <div className={`h-16 w-16 ${item.bg} rounded-full mb-6 flex items-center justify-center`}>
                {item.icon}
              </div>

              <h3 className="font-bold text-[#0B1F3A] mb-3 text-lg">{item.title}</h3>

              <p className="text-sm text-gray-500 mb-6 flex-grow">
                {item.text}
              </p>

              <a href="#" className="text-sm font-semibold text-[#0B1F3A] hover:text-[#F5B400] transition">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT */}
      <section id="spotlight" className="py-24 px-10 bg-white">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">

          <div>
            <p className="text-[#F5B400] text-sm font-bold tracking-wider mb-2 uppercase">Alumni Spotlight</p>
            <h2 className="text-4xl font-extrabold mb-8 text-[#0B1F3A]">Stories That Inspire</h2>

            <div className="text-[60px] leading-none text-[#F5B400] font-serif mb-4">“</div>

            <p className="text-xl text-gray-500 italic leading-relaxed mb-8">
              Happiness Center gave me the confidence to dream bigger and the support to chase those dreams. The bonds and lessons from here stay with me every day.
            </p>

            <div className="mb-8">
              <p className="font-bold text-[#0B1F3A] text-lg">Muskaan Arora</p>
              <p className="text-sm text-gray-400">Batch of 2022</p>
              <p className="text-sm text-gray-400">Content Creator | Storyteller</p>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
              <div className="h-2 w-6 bg-[#0B1F3A] rounded-full"></div>
              <div className="h-2 w-2 bg-gray-200 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-200 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <div className="relative">
            <img src="/person.jpg" alt="Muskaan Arora"
              className="rounded-3xl shadow-xl object-cover w-full h-auto"/>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-10 bg-[#F8F9FB] text-center relative">
        <p className="text-[#F5B400] text-sm font-bold tracking-wider mb-2 uppercase">Voices of Happiness</p>
        <h2 className="text-4xl font-extrabold mb-12 text-[#0B1F3A]">What Our Alumni Say</h2>

        <div className="max-w-7xl mx-auto relative flex items-center justify-center">
          
          <button className="hidden md:flex absolute -left-4 md:-left-12 bg-[#0B1F3A] text-white p-2 rounded-full hover:scale-110 transition z-10">
            <ChevronLeft size={24} />
          </button>

          <div className="grid md:grid-cols-3 gap-6 w-full">
            {[
              {
                quote: "The Happiness Center isn't just a memory, it's a part of who I am today. Grateful for the people, values and joy it gave me.",
                name: "Rohit Mehta",
                batch: "Batch of 2021",
                avatar: "https://randomuser.me/api/portraits/men/44.jpg"
              },
              {
                quote: "From late-night talks to life-changing lessons—this place shaped my journey. Proud to stay connected with this amazing community.",
                name: "Simran Kaur",
                batch: "Batch of 2020",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "Being a part of this network makes me feel I'm still home, no matter where I am.",
                name: "Aman Verma",
                batch: "Batch of 2019",
                avatar: "https://randomuser.me/api/portraits/men/46.jpg"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="text-[40px] leading-none text-[#0B1F3A] font-serif mb-2">“</div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#0B1F3A] text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.batch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="hidden md:flex absolute -right-4 md:-right-12 bg-[#0B1F3A] text-white p-2 rounded-full hover:scale-110 transition z-10">
            <ChevronRight size={24} />
          </button>

        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="h-2 w-6 bg-[#0B1F3A] rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta"
        className="py-24 px-10 text-white text-center bg-[#0B1F3A] relative overflow-hidden">

        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be Part of the Journey
          </h2>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Stay connected with the Happiness Center,<br/> wherever life takes you.
          </p>

          <button onClick={handleLogin}
            className="bg-[#F5B400] text-[#0B1F3A] px-8 py-3 rounded font-bold hover:scale-105 transition shadow-lg flex items-center justify-center mx-auto gap-2">
            Join the Network <span>→</span>
          </button>
        </div>
      </section>

    </div>
  );
}
