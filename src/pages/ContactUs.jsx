import { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook up form submission logic here
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative border-b border-sky-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-wide text-white bg-white/10 rounded-full px-3 py-1 mb-4">
            CONTACT US
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Let's talk about
            <span className="text-sky-200">
              {" "}
              your business
            </span>
          </h1>
          <p className="text-sky-100 text-lg mt-6 max-w-2xl mx-auto">
            Tell us a bit about what you're working on. We typically respond
            within one business day.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Email
              </h2>
              <a
                href="mailto:infokbl@nawisaadi.com"
                className="text-sky-600 hover:text-sky-700 text-sm font-medium"
              >
                infokbl@nawisaadi.com
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Phone
              </h2>
              <a
                href="tel:+93 79 820 3051"
                className="text-sky-600 hover:text-sky-700 text-sm font-medium"
              >
                +93 79 820 3051
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Office
              </h2>
              <p className="text-sm text-slate-500">
                Khost Tower, Jade Maiwand Road,
                <br />
                Kabul, Afghanistan.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Hours
              </h2>
              <p className="text-sm text-slate-500">
                Sat – Thursday, 8am – 7pm AFT
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              {["LinkedIn", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="px-4 py-2 rounded-full border border-sky-200 text-sky-600 text-xs font-medium hover:bg-sky-50 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-xl border border-sky-100 p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Message sent
                </h2>
                <p className="text-sm text-slate-500">
                  Thanks for reaching out. We'll get back to you within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a bit about what you're working on..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-sky-500 hover:to-indigo-600 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
