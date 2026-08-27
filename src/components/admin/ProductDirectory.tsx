import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Clock,
  RotateCcw,
  Eye,
  Sliders,
  Sparkles,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { Product } from '../../types';

export const ProductDirectory: React.FC = () => {
  const {
    products,
    language,
    adminApproveProduct,
    adminRequestProductChanges,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      return true;
    }

    const pName = (p.name || '').toLowerCase();
    const pBrand = (p.brandName || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pSubCat = (p.subcategory || '').toLowerCase();

    const matchesSearch =
      pName.includes(q) ||
      pBrand.includes(q) ||
      pCat.includes(q) ||
      pSubCat.includes(q);

    if (!matchesSearch) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" />
            {language === 'bn' ? 'প্রোডাক্ট ডিরেক্টরি (Product Directory & Catalog)' : 'Product Directory & Compliance Catalog'}
          </h3>
          <p className="text-xs text-white/50">
            {language === 'bn'
              ? 'প্ল্যাটফর্মের সকল পণ্যের টেস্টিং নির্দেশিকা, ডু-অ্যান্ড-ডোন্টস, রিটার্ন শর্ত ও অ্যাডমিন কোয়ালিটি অ্যাপ্রুভাল'
              : 'All testing products across stores, testing protocols, safety instructions, return status, and compliance approval'}
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি দিয়ে খুঁজুন...' : 'Search by product, brand, category...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50 transition-all"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
              filterCategory === cat
                ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat === 'all' ? (language === 'bn' ? 'সকল পণ্য' : 'All Products') : cat}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{language === 'bn' ? 'পণ্য ও ছবি' : 'Product & Image'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ব্র্যান্ড ও স্টোর' : 'Brand & Store'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'খুচরা মূল্য' : 'Retail Price'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'টেস্টিং সময়' : 'Testing Time'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'রিটার্নযোগ্য?' : 'Returnable?'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'অনুমোদন' : 'Approval'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/40">
                    {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isApproved = (prod.approvalStatus || 'approved') === 'approved';

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      {/* Product Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            className="w-11 h-11 rounded-xl object-cover border border-white/10"
                          />
                          <div className="max-w-[220px]">
                            <div className="font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-white/40">
                              {prod.productFamily || prod.subcategory}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Store */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{prod.storeName || prod.brandName}</div>
                        <div className="text-[10px] text-white/40">{prod.ownerName || 'Verified Merchant'}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/80">
                          {prod.category}
                        </span>
                      </td>

                      {/* Retail Price */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        {formatBdt(prod.retailPriceBdt, language)}
                      </td>

                      {/* Testing Duration */}
                      <td className="py-3.5 px-3 text-white/80 font-mono">
                        {prod.requiredTestingDurationDays} {language === 'bn' ? 'দিন' : 'days'}
                      </td>

                      {/* Is Returnable */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                            prod.isReturnable
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{prod.isReturnable ? (language === 'bn' ? 'রিটার্ন আবশ্যক' : 'Returnable') : (language === 'bn' ? 'রিভিউয়ারের উপহার' : 'Kept by Reviewer')}</span>
                        </span>
                      </td>

                      {/* Approval Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(prod);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-white/80 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'পরিদর্শন' : 'Inspect'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sky-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedProduct.name}</h2>
                  </div>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    Store: {selectedProduct.storeName || selectedProduct.brandName} • Category: {selectedProduct.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Product Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedProduct.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product Preview ${idx}`}
                  className="w-full h-28 rounded-xl object-cover border border-white/10"
                />
              ))}
            </div>

            {/* Description & Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {language === 'bn' ? 'উপাদান ও স্পেসিফিকেশন' : 'Ingredients & Specs'}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {selectedProduct.ingredientsOrSpecs}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {language === 'bn' ? 'টেস্টিং নির্দেশিকা ও নিরাপত্তা' : 'Testing & Safety Protocol'}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {selectedProduct.testingInstructions}
                </p>
                <div className="text-[11px] text-amber-300/80 mt-1">
                  ⚠️ {selectedProduct.safetyInstructions}
                </div>
              </div>
            </div>

            {/* Supported & Prohibited Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'অনুমোদিত বক্তব্য (Supported Claims)' : 'Supported Claims'}
                </h4>
                <ul className="space-y-1 text-xs text-emerald-200/90 list-disc list-inside">
                  {selectedProduct.supportedClaims.map((claim, idx) => (
                    <li key={idx}>{claim}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  {language === 'bn' ? 'নিষিদ্ধ বা বানোয়াট দাবি (Prohibited Claims)' : 'Prohibited Claims'}
                </h4>
                <ul className="space-y-1 text-xs text-rose-200/90 list-disc list-inside">
                  {selectedProduct.prohibitedClaims.map((claim, idx) => (
                    <li key={idx}>{claim}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {language === 'bn' ? 'অ্যাডমিন প্রোডাক্ট অনুমোদন' : 'Admin Compliance Decision'}
              </h4>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    adminApproveProduct(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'পণ্য অনুমোদন করুন' : 'Approve Product for Campaigns'}
                </button>

                <button
                  onClick={() => {
                    const note = prompt(
                      language === 'bn' ? 'সংশোধনের বিবরণ দিন:' : 'Enter revision notes:',
                      'দয়া করে উপাদান বা স্পেসিফিকেশনের বিস্তারিত ল্যাব টেস্ট রিপোর্ট যুক্ত করুন।'
                    );
                    if (note) {
                      adminRequestProductChanges(selectedProduct.id, note);
                      setSelectedProduct(null);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-purple-500/30"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {language === 'bn' ? 'সংশোধন চান' : 'Request Revision'}
                </button>
              </div>
            </div>

            {/* Footer Close */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Drawer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
