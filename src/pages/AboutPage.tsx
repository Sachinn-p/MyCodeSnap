import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Paintbrush, Share2, Sparkles, TerminalSquare } from "lucide-react";

export default function AboutPage() {
  // Dynamic SEO Update
  useEffect(() => {
    document.title = "About | MyCodeSnap";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn more about MyCodeSnap, the powerful tool for developers to create stunning, share-ready screenshots of source code, API requests, and terminal outputs.');
    }
    
    return () => {
      // Revert to default
      document.title = "Code Snippet Image Generator - Share Code | MyCodeSnap";
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Need a code snippet image generator? Turn your source code into beautiful, shareable screenshots with our developer tool. Start creating free!');
      }
    };
  }, []);

  return (
    <div className="h-full bg-neutral-950 text-neutral-200 font-sans selection:bg-white/20 overflow-y-auto pb-8">
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors group bg-neutral-900/50 hover:bg-neutral-800/80 px-4 py-2 rounded-full border border-neutral-800"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Canvas
          </Link>
        </motion.nav>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-xl mb-8">
            <img src="/logo.png" alt="MyCodeSnap Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-100 mb-6">
            Make your code beautiful.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            MyCodeSnap is a powerful, highly customizable canvas tool designed for developers to create stunning, share-ready screenshots of their source code, API requests, and terminal outputs.
          </p>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-24"
        >
          {[
            {
              icon: <Code2 size={24} />,
              title: "Syntax Highlighting",
              desc: "Support for dozens of languages with beautiful, accurate syntax highlighting powered by PrismJS."
            },
            {
              icon: <Paintbrush size={24} />,
              title: "Endless Customization",
              desc: "Tweak paddings, border radiuses, box shadows, background gradients, and window controls to match your brand."
            },
            {
              icon: <TerminalSquare size={24} />,
              title: "Multi-Node Canvas",
              desc: "Don't just share code. Add terminal windows, database tables, and API previews all on the same unlimited canvas."
            },
            {
              icon: <Share2 size={24} />,
              title: "High-Res Export",
              desc: "Export to PNG, JPEG, SVG, or PDF at retina resolutions so your snippets look crisp on any display or presentation."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-8 rounded-3xl hover:bg-neutral-900/80 transition-colors">
              <div className="flex items-center gap-4 mb-4 text-neutral-300">
                {feature.icon}
                <h2 className="text-xl font-bold text-neutral-100">{feature.title}</h2>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-neutral-900 border border-neutral-800 rounded-3xl p-12 relative overflow-hidden"
        >
          <Sparkles className="absolute top-6 right-6 text-neutral-800 w-32 h-32 rotate-12" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-neutral-100 mb-4">Ready to snap your code?</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Join thousands of developers sharing beautiful code snippets on social media, blogs, and presentations.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-neutral-100 text-neutral-950 hover:bg-white font-bold px-8 py-4 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Open Canvas Editor
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-24 pt-8 pb-4 border-t border-neutral-800/50 text-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} MyCodeSnap. Built for developers.</p>
        </footer>
      </div>
    </div>
  );
}
