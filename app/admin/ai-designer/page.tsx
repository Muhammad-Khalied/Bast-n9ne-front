'use client';

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { toast } from "react-hot-toast";
import { 
  Save, 
  Sparkles,
  Settings,
  AlertCircle
} from "lucide-react";
import { TShirtMockup } from "../../../components/ai-designer/TShirtMockup";

const AVAILABLE_COLORS = ["White", "Black", "Navy", "Gray", "Red"];

export default function AdminAiDesignerSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [enabled, setEnabled] = useState(true);
  const [price, setPrice] = useState(599);
  const [maxPromptLength, setMaxPromptLength] = useState(500);
  const [generationLimit, setGenerationLimit] = useState(5);
  const [selectedColors, setSelectedColors] = useState<string[]>(AVAILABLE_COLORS);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/ai/settings");
      const settings = res.data.data;
      
      if (settings.ai_designer_enabled !== undefined) setEnabled(settings.ai_designer_enabled);
      if (settings.ai_tshirt_price !== undefined) setPrice(Number(settings.ai_tshirt_price));
      if (settings.ai_max_prompt_length !== undefined) setMaxPromptLength(Number(settings.ai_max_prompt_length));
      if (settings.ai_generation_limit !== undefined) setGenerationLimit(Number(settings.ai_generation_limit));
      if (settings.ai_tshirt_colors) {
        // Handle array or string
        const colors = Array.isArray(settings.ai_tshirt_colors) 
          ? settings.ai_tshirt_colors 
          : JSON.parse(settings.ai_tshirt_colors);
        setSelectedColors(colors);
      }
    } catch (err) {
      toast.error("Failed to load AI Designer settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToUpdate = [
        { key: "ai_designer_enabled", value: enabled, group: "ai_designer" },
        { key: "ai_tshirt_price", value: price, group: "ai_designer" },
        { key: "ai_max_prompt_length", value: maxPromptLength, group: "ai_designer" },
        { key: "ai_generation_limit", value: generationLimit, group: "ai_designer" },
        { key: "ai_tshirt_colors", value: JSON.stringify(selectedColors), group: "ai_designer" }
      ];

      await api.patch("/admin/ai/settings", { settings: settingsToUpdate });
      toast.success("AI Designer settings saved successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display text-brand-black flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-brand-sage" />
            AI Designer Settings
          </h1>
          <p className="text-brand-muted mt-2 text-sm max-w-xl">
            Configure pricing, limits, and availability for the AI-powered custom t-shirt generator.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-black text-brand-white px-6 py-3 rounded-brand font-bold text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-brand-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-sage" /> General Configuration
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-brand-ivory/30 rounded-brand border border-brand-ivory-dark">
                <div>
                  <h4 className="font-bold text-brand-black text-sm">Enable AI Designer</h4>
                  <p className="text-xs text-brand-muted mt-1">Allow customers to generate custom designs.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                  <div className="w-11 h-6 bg-brand-ivory-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-sage"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">
                    Custom T-Shirt Price (EGP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-brand-white border border-brand-ivory-dark rounded-brand text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                  <p className="text-[10px] text-brand-muted mt-2">The fixed price for all generated designs.</p>
                </div>

                {/* Rate Limit */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">
                    Generations Per Hour
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={generationLimit}
                    onChange={(e) => setGenerationLimit(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-brand-white border border-brand-ivory-dark rounded-brand text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                  <p className="text-[10px] text-brand-muted mt-2">Limit generations per user to control API costs.</p>
                </div>
              </div>

              {/* Prompt Length */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">
                  Max Prompt Length (Characters)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={maxPromptLength}
                  onChange={(e) => setMaxPromptLength(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-brand-white border border-brand-ivory-dark rounded-brand text-sm focus:outline-none focus:border-brand-sage transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Color Availability */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                Available Colors
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-brand-muted mb-4">Select which t-shirt colors customers can choose for their custom designs.</p>
              
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-4 py-2 border rounded-brand text-sm font-medium transition-colors ${
                      selectedColors.includes(color) 
                        ? 'border-brand-sage bg-brand-sage/10 text-brand-sage' 
                        : 'border-brand-ivory-dark text-brand-muted hover:border-brand-sage/30'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-brand-sage/10 rounded-brand-lg border border-brand-sage/20 p-6">
            <h3 className="font-bold text-brand-black mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-sage" />
              API Costs Warning
            </h3>
            <p className="text-sm text-brand-charcoal leading-relaxed mb-4">
              AI generation uses OpenAI's DALL-E models which incur per-image costs. Please ensure your pricing model accounts for these API costs.
            </p>
            <p className="text-xs text-brand-muted">
              Current Model: <span className="font-mono bg-white px-1.5 py-0.5 rounded">gpt-image-1-mini</span>
            </p>
          </div>
          
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark p-6 flex flex-col items-center justify-center">
             <TShirtMockup color="Black" className="w-40" />
             <p className="text-[10px] uppercase font-bold tracking-widest text-brand-muted mt-4">Preview Example</p>
          </div>
        </div>
      </div>
    </div>
  );
}
