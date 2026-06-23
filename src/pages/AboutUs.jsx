import { Link } from "react-router-dom";

const VALUES = [
  {
    title: "Our Mission",
    description:
      "We explain the reasoning behind every recommendation in plain language, so you're never just taking our word for it.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Outcomes, not hours",
    description:
      "We measure our work by the results it produces for your business, not by the number of hours we bill.",
    image:
      "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Built to last",
    description:
      "We design solutions your team can own and run long after our engagement ends, not dependencies that keep you coming back.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
];

const TEAM = [
  {
    name: "Shafiqullah Zazai",
    role: "Founder & Principal Consultant",
    bio: "15 years advising mid-market companies on growth strategy and operations.",
  },
  {
    name: "Ahmad Ayaz",
    role: "Head of Client Strategy",
    bio: "Former operations lead who has run point on over 80 client engagements.",
  },
  {
    name: "Mohammad Usman",
    role: "Lead Analyst",
    bio: "Specializes in turning messy data into decisions leadership teams can act on.",
  },
];

function AboutUs() {
  return (
    <div className="bg-white transition-colors duration-300">
      {/* Hero */}
      <section
        className="relative border-b border-sky-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-wide text-white bg-white/10 rounded-full px-3 py-1 mb-4">
            ABOUT US
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Nawi Saadi
            <span className="text-sky-200">
              {" "}
              Travel & Tourism
            </span>
          </h1>
          <p className="text-sky-100 text-lg mt-6 max-w-2xl mx-auto">
            Founded in 2015, we're a consulting firm that partners with
            ambitious teams to solve hard strategic and operational problems,
            without the bloated decks or empty buzzwords.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Our story
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We started this firm after years of watching good companies get
              bad advice: generic frameworks, recycled slide decks, and
              recommendations no one stuck around to implement.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              So we built something different. A small team that gets deeply
              involved in your business, gives it to you straight, and stays
              accountable to the results, not just the report.
            </p>
            <p className="text-slate-600 leading-relaxed ">
              Since our inception, we have remained committed to delivering personalized services to both individual and corporate clients. Through consistent dialogue with our customers, we gain a deep understanding of their needs and offer tailor-made solutions, competitive fares, and round-the-clock support (24/7 service). NST continues to grow steadily, driven by our principles of reliability, quality service, and customer satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100">
              <p className="text-3xl font-bold text-sky-600">120+</p>
              <p className="text-sm text-slate-500 mt-1">
                Clients advised since 2015
              </p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-3xl font-bold text-indigo-600">94%</p>
              <p className="text-sm text-slate-500 mt-1">
                Client retention rate
              </p>
            </div>
            <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100">
              <p className="text-3xl font-bold text-sky-600">11</p>
              <p className="text-sm text-slate-500 mt-1">
                Years in business
              </p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-3xl font-bold text-indigo-600">8</p>
              <p className="text-sm text-slate-500 mt-1">
                Industries served
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-sky-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
            What guides our work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm"
              >
                {value.image && (
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}

                <h3 className="font-semibold text-slate-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          Meet the team
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="font-semibold text-slate-800">{member.name}</h3>
              <p className="text-sm text-sky-600 font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-400 to-indigo-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to talk about your business?
          </h2>
          <p className="text-sky-50 mb-8">
            Tell us where you're stuck, and we'll tell you honestly whether we
            can help.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-full bg-white text-sky-600 font-semibold hover:bg-sky-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
