"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { Button, Input } from "../../../components/ui";
import { toast } from "react-hot-toast";
import { 
  Save, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Megaphone, 
  Share2, 
  PhoneCall,
  ShieldCheck,
  Mail,
  AlignLeft,
  Settings,
  Tag,
  Plus,
  Trash,
  Truck,
  RefreshCw,
  Clock,
  Star,
  Heart,
  CheckCircle,
  Package,
  Zap
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Truck, RefreshCw, ShieldCheck, Clock, Star, Heart, CheckCircle, Package, Zap
};

const defaultTrustSignals = [
  { id: "1", icon: "Truck", title: "Fixed Shipping", description: "Flat rate of EGP 150 on all orders." },
  { id: "2", icon: "RefreshCw", title: "Easy Returns", description: "30-day return policy for all items." },
  { id: "3", icon: "ShieldCheck", title: "Secure Checkout", description: "100% secure payment processing." },
  { id: "4", icon: "Star", title: "Premium Quality", description: "Crafted with the finest materials." }
];

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/settings");
      const data = res.data.data;
      const settingsMap: Record<string, any> = {};
      data.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });

      if (!settingsMap.trust_signals || settingsMap.trust_signals.length === 0) {
        settingsMap.trust_signals = defaultTrustSignals;
      }

      setSettings(settingsMap);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Prepare settings for bulk update
    const settingsList = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      group: key.split("_")[0], // Simple grouping logic
    }));

    try {
      await api.patch("/settings", { settings: settingsList });
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleAddTrustSignal = () => {
    const currentSignals = settings.trust_signals || [];
    updateSetting("trust_signals", [
      ...currentSignals, 
      { id: Date.now().toString(), icon: "CheckCircle", title: "New Signal", description: "Signal description" }
    ]);
  };

  const handleUpdateTrustSignal = (index: number, field: string, value: string) => {
    const currentSignals = [...(settings.trust_signals || [])];
    currentSignals[index] = { ...currentSignals[index], [field]: value };
    updateSetting("trust_signals", currentSignals);
  };

  const handleRemoveTrustSignal = (index: number) => {
    const currentSignals = [...(settings.trust_signals || [])];
    currentSignals.splice(index, 1);
    updateSetting("trust_signals", currentSignals);
  };

  const availableIcons = ["Truck", "RefreshCw", "ShieldCheck", "Clock", "Star", "Heart", "CheckCircle", "Package", "Zap"];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Site Settings</h1>
          <p className="text-sm text-brand-muted">Customize your website's content and appearance</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-black text-brand-white hover:bg-brand-charcoal px-6 py-2 h-auto text-xs uppercase font-bold tracking-widest"
        >
          {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save All Changes</span>}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-10 pb-20">
        {/* General Settings */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">General Settings</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Site Name</label>
              <Input 
                value={settings.site_name || "Bast n9ne"}
                onChange={(e) => updateSetting("site_name", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Site Description (SEO)</label>
              <textarea 
                rows={2}
                className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                value={settings.site_description || "Luxury streetwear crafted for the modern wardrobe."}
                onChange={(e) => updateSetting("site_description", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <Layout className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Hero Banner</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Overline Text</label>
                  <Input 
                    value={settings.hero_overline || "New Collection 2026"}
                    onChange={(e) => updateSetting("hero_overline", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Main Title</label>
                  <textarea 
                    rows={2}
                    className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                    value={settings.hero_title || "ELEVATE YOUR\nEVERYDAY"}
                    onChange={(e) => updateSetting("hero_title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                    value={settings.hero_description || "Luxury streetwear crafted for the modern wardrobe. Discover silhouettes designed for comfort without compromising style."}
                    onChange={(e) => updateSetting("hero_description", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Button Text</label>
                  <Input 
                    value={settings.hero_button_text || "Shop New Arrivals"}
                    onChange={(e) => updateSetting("hero_button_text", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Background Image URL</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="/Home.png"
                      value={settings.hero_image || ""}
                      onChange={(e) => updateSetting("hero_image", e.target.value)}
                    />
                    <div className="w-12 h-12 bg-brand-ivory rounded border border-brand-ivory-dark flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img src={settings.hero_image || "/Home.png"} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Collections */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <Layout className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Explore Collections</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Section Title</label>
              <Input 
                value={settings.explore_title || "Explore Collections"}
                onChange={(e) => updateSetting("explore_title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Section Subtitle</label>
              <Input 
                value={settings.explore_subtitle || "Curated selections for every occasion."}
                onChange={(e) => updateSetting("explore_subtitle", e.target.value)}
              />
            </div>
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Collection {num}</label>
                <select
                  className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                  value={settings[`explore_collection_${num}`] || ""}
                  onChange={(e) => updateSetting(`explore_collection_${num}`, e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Section */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Editorial Section</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Overline</label>
                <Input 
                  value={settings.editorial_overline || "The Design Philosophy"}
                  onChange={(e) => updateSetting("editorial_overline", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Title</label>
                <textarea 
                  rows={2}
                  className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                  value={settings.editorial_title || "REDEFINING \n THE BASICS."}
                  onChange={(e) => updateSetting("editorial_title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                  value={settings.editorial_description || "Every piece in the Bast n9ne collection is meticulously crafted to balance form and function. We believe that true luxury lies in the details—the weight of the cotton, the precision of the cut, and the durability of the stitch."}
                  onChange={(e) => updateSetting("editorial_description", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Button Text</label>
                <Input 
                  value={settings.editorial_button_text || "Discover Our Story"}
                  onChange={(e) => updateSetting("editorial_button_text", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Image URL</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://..."
                    value={settings.editorial_image || ""}
                    onChange={(e) => updateSetting("editorial_image", e.target.value)}
                  />
                  <div className="w-12 h-12 bg-brand-ivory rounded border border-brand-ivory-dark flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {settings.editorial_image ? <img src={settings.editorial_image} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-brand-muted" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-sage" />
              <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Trust Signals</h2>
            </div>
            <Button onClick={handleAddTrustSignal} className="gap-2 bg-transparent border border-brand-ivory-dark text-brand-black hover:bg-brand-ivory-light text-xs px-3 py-1.5 shadow-sm">
              <Plus className="w-4 h-4" /> Add Signal
            </Button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(settings.trust_signals || []).map((signal: any, index: number) => (
              <div key={signal.id || index} className="space-y-4 p-4 border border-brand-ivory-dark rounded-brand bg-brand-ivory/10 relative group">
                <button 
                  onClick={() => handleRemoveTrustSignal(index)}
                  className="absolute top-4 right-4 text-brand-muted hover:text-status-error transition-colors"
                  title="Remove Signal"
                >
                  <Trash className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-brand-black text-xs uppercase tracking-widest">Signal {index + 1}</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Icon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-[46px] h-[46px] border border-brand-ivory-dark rounded-brand flex items-center justify-center bg-brand-white shrink-0 text-brand-sage shadow-sm">
                      {(() => {
                        const IconComponent = iconMap[signal.icon || "CheckCircle"] || iconMap["CheckCircle"];
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                    </div>
                    <select
                      className="flex-1 rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                      value={signal.icon || "CheckCircle"}
                      onChange={(e) => handleUpdateTrustSignal(index, "icon", e.target.value)}
                    >
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Title</label>
                  <Input 
                    value={signal.title || ""}
                    placeholder="e.g. Fixed Shipping"
                    onChange={(e) => handleUpdateTrustSignal(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Description</label>
                  <Input 
                    value={signal.description || ""}
                    placeholder="e.g. Flat rate of EGP 150 on all orders."
                    onChange={(e) => handleUpdateTrustSignal(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
            {(!settings.trust_signals || settings.trust_signals.length === 0) && (
              <div className="col-span-1 md:col-span-2 text-center py-8 text-brand-muted border border-dashed border-brand-ivory-dark rounded-brand">
                No trust signals added. Click "Add Signal" to create one.
              </div>
            )}
          </div>
        </section>

        {/* Product UI Settings */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Product UI Settings</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Sale Badge Text</label>
              <Input 
                value={settings.product_sale_badge_text || "Sale"}
                onChange={(e) => updateSetting("product_sale_badge_text", e.target.value)}
                placeholder="e.g. Sale, Discount, -20%"
              />
            </div>
          </div>
        </section>

        {/* Contact & Social */}
        <section className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-brand-sage" />
            <h2 className="font-bold text-brand-black text-sm uppercase tracking-wider">Contact & Social</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Customer Support Email</label>
              <Input 
                value={settings.contact_email || "support@bastn9ne.local"}
                onChange={(e) => updateSetting("contact_email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Phone Number</label>
              <Input 
                value={settings.contact_phone || "+1 234 567 890"}
                onChange={(e) => updateSetting("contact_phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Instagram URL</label>
              <Input 
                value={settings.social_instagram || ""}
                onChange={(e) => updateSetting("social_instagram", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Facebook URL</label>
              <Input 
                value={settings.social_facebook || ""}
                onChange={(e) => updateSetting("social_facebook", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Twitter URL</label>
              <Input 
                value={settings.social_twitter || ""}
                onChange={(e) => updateSetting("social_twitter", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Hours of Operation</label>
              <textarea 
                rows={5}
                className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                value={settings.hours_of_operation || "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed"}
                onChange={(e) => updateSetting("hours_of_operation", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Footer Description</label>
              <textarea 
                rows={2}
                className="w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-4 py-3 text-sm focus:border-brand-sage focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all"
                value={settings.footer_description || "Luxury streetwear crafted for the modern wardrobe. Redefining everyday essentials with premium materials."}
                onChange={(e) => updateSetting("footer_description", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Copyright Text</label>
              <Input 
                value={settings.footer_copyright || `© ${new Date().getFullYear()} Bast n9ne. All rights reserved.`}
                onChange={(e) => updateSetting("footer_copyright", e.target.value)}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
