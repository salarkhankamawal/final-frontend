import { Link } from "react-router-dom";

const SERVICES = [
  {
    title: "Strategy Consulting",
    tagline: "Find the move that actually matters",
    description:
      "We work with leadership teams to cut through competing priorities and identify the two or three moves that will actually shift the business this year.",
    features: [
      "Market and competitive analysis",
      "Growth and pricing strategy",
      "Board-ready strategic plans",
    ],
    color: "sky",
  },
  {
    title: "Operations Improvement",
    tagline: "Make the engine run smoother",
    description:
      "We map how work actually happens inside your business, find where it breaks down, and redesign the process so it scales without adding headcount.",
    features: [
      "Process mapping and redesign",
      "Cost and efficiency audits",
      "Workflow and tooling rollout",
    ],
    color: "indigo",
  },
  {
    title: "Data & Analytics Advisory",
    tagline: "Turn your data into decisions",
    description:
      "We help you go from scattered spreadsheets to a reporting setup leadership actually trusts and uses to make weekly decisions.",
    features: [
      "Reporting and dashboard design",
      "Data infrastructure review",
      "Decision-support frameworks",
    ],
    color: "sky",
  },
];

const PROCESS = [
  {
    step: "Discover",
    description: "We learn your business, your data, and where it hurts.",
  },
  {
    step: "Diagnose",
    description: "We pinpoint the root cause, not just the symptom.",
  },
  {
    step: "Design",
    description: "We build a plan your team can realistically execute.",
  },
  {
    step: "Deliver",
    description: "We stay hands-on through rollout until it sticks.",
  },
];

function Services() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative border-b border-sky-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-wide text-white bg-white/10 rounded-full px-3 py-1 mb-4">
            SERVICES
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Consulting built around
            <span className="text-sky-200">
              {" "}
              your outcomes
            </span>
          </h1>
          <p className="text-sky-100 text-lg mt-6 max-w-2xl mx-auto">
            Three focused service lines, each designed to solve a specific
            kind of problem rather than offer a one-size-fits-all package.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              className={`grid md:grid-cols-5 gap-6 items-start rounded-2xl border p-8 ${
                service.color === "sky"
                  ? "border-sky-100 bg-sky-50/50"
                  : "border-indigo-100 bg-indigo-50/50"
              }`}
            >
              <div className="md:col-span-2">
                <span
                  className={`text-xs font-semibold tracking-wide rounded-full px-3 py-1 ${
                    service.color === "sky"
                      ? "text-sky-600 bg-sky-100"
                      : "text-indigo-600 bg-indigo-100"
                  }`}
                >
                  0{index + 1}
                </span>
                <h2 className="text-2xl font-bold text-slate-800 mt-3">
                  {service.title}
                </h2>
                <p
                  className={`text-sm font-medium mt-1 ${
                    service.color === "sky" ? "text-sky-600" : "text-indigo-600"
                  }`}
                >
                  {service.tagline}
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${
                          service.color === "sky"
                            ? "text-sky-500"
                            : "text-indigo-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 border-y border-sky-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
            How an engagement works
          </h2>
          <p className="text-slate-500 text-center mb-10">
            A consistent process, regardless of which service you start with.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PROCESS.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm mb-3">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  {item.step}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-400 to-indigo-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Not sure which service fits?
          </h2>
          <p className="text-sky-50 mb-8">
            Send us a few lines about your situation and we'll point you in
            the right direction, even if that's not us.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-full bg-white text-sky-600 font-semibold hover:bg-sky-50 transition-colors"
          >
            Talk to Us
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;
