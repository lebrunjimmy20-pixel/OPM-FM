import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, BookOpen, Shield, CreditCard, Monitor, Activity, ExternalLink, LifeBuoy } from 'lucide-react';

const FAQS = [
    {
        question: "How do I add a new device?",
        answer: "To add a new device, click on the 'Devices & Sensors' link in the sidebar, choose the appropriate building from the top navbar, and then click the 'Add Device' button in the top right. Follow the prompts in the modal to complete the process."
    },
    {
        question: "How are energy usage reports generated?",
        answer: "Our system automatically aggregates data from all connected IoT sensors and utility meters. Reports are generated in real-time and can be accessed via the 'Sustainability Goals' page or the main dashboard."
    },
    {
        question: "Can I manage multiple buildings?",
        answer: "Yes, OPM.FM is designed for multi-building management. You can switch between your properties using the building selector found at the top of the 'Devices & Sensors' page."
    },
    {
        question: "What should I do if a device goes offline?",
        answer: "First, check the physical power source and network connection of the device. If the issue persists, you can open a Work Order directly from the 'Work Orders' page for a technician to investigate."
    },
    {
        question: "Is my data secure?",
        answer: "Security is our top priority. All communications are encrypted, and we use industry-standard authentication (Supabase) to ensure only authorized personnel can access your building data."
    }
];

const CATEGORIES = [
    { icon: Monitor, title: "Getting Started", description: "Learn the basics of using OPM.FM", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Shield, title: "Account & Security", description: "Manage your profile and permissions", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: CreditCard, title: "Billing & Plans", description: "Invoices, subscriptions, and payments", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Activity, title: "Device Issues", description: "Troubleshooting offline sensors & meters", color: "text-red-500", bg: "bg-red-50" }
];

const HelpSupport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto font-sans pb-20">
            {/* Hero Section */}
            <div className="relative rounded-[32px] bg-emerald-600 p-12 text-center text-white overflow-hidden mb-12 shadow-[0_32px_80px_-24px_rgba(4,99,7,0.35)]">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/10 rounded-full blur-[100px]" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LifeBuoy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">How can we help?</h1>
                    <p className="text-emerald-50 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 opacity-90">
                        Search or browse our help center to find answers to common questions about OPM.FM
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for articles, guides, or FAQs..."
                            className="w-full bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl pl-12 pr-6 py-5 text-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all focus:bg-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {CATEGORIES.map((cat, idx) => (
                    <button key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group">
                        <div className={`w-12 h-12 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{cat.description}</p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* FAQ Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                    >
                                        <span className="font-bold text-gray-800 tracking-tight group-hover:text-emerald-600 transition-colors uppercase text-sm">
                                            {faq.question}
                                        </span>
                                        {openFaq === idx ? (
                                            <ChevronUp className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                                        )}
                                    </button>
                                    <div className={`px-6 transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">No results found for "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="text-emerald-600 font-bold mt-2 hover:underline">Clear search</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Still need help?</h3>
                        <div className="space-y-4">
                            <a href="mailto:support@opm.fm" className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Email Us</p>
                                    <p className="text-xs text-gray-500 italic">Response in 24h</p>
                                </div>
                            </a>

                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group text-left">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Live Chat</p>
                                    <p className="text-xs text-gray-500 italic">Talk to a specialist</p>
                                </div>
                            </button>

                            <a href="tel:+1234567890" className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Call Us</p>
                                    <p className="text-xs text-gray-500 italic">Mon-Fri, 9am - 5pm</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">System Status</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-bold text-emerald-600 text-sm uppercase">All Systems Operational</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-4 flex items-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors">
                            View detailed status <ExternalLink className="w-3 h-3" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
