import re

with open('/Users/alejandroibarra/Desktop/Photos/moment-app/Front/pages/dashboard/customer/index.vue', 'r') as f:
    content = f.read()

# Replace the root and header
header_regex = re.compile(r'<div class="min-h-screen bg-gray-50/50 pb-20">.*?<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">.*?<!-- Profile Card -->.*?<div class="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-900/5 rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 transition-all hover:shadow-indigo-900/10">', re.DOTALL)

old_header = """  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Profile Header (Instagram Style) -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">"""

content = header_regex.sub(old_header, content)

# Avatar styles
content = content.replace('w-36 h-36 md:w-44 md:h-44 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3', 'w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#3ef4a1] p-1 transition-transform group-hover:scale-105')
content = content.replace('w-full h-full rounded-[1.8rem] bg-white p-1', 'w-full h-full rounded-full bg-white p-1')
content = content.replace('w-full h-full rounded-[1.6rem] bg-gray-100 flex items-center justify-center overflow-hidden', 'w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100')
content = content.replace('bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all duration-300 backdrop-blur-sm', 'bg-black/20 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity')

# Text styles
content = content.replace('text-3xl font-extrabold text-gray-900 tracking-tight', 'text-2xl font-light text-gray-800')
content = content.replace('bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2', 'px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2')
content = content.replace('text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 whitespace-pre-wrap', 'text-gray-500 whitespace-pre-wrap')

# Stats
content = content.replace('mt-6 pt-6 border-t border-gray-100', 'mb-4 text-sm')
content = content.replace('block text-2xl font-black text-indigo-600', 'text-gray-900')
content = content.replace('text-xs font-bold text-gray-400 uppercase tracking-wider', '')
content = content.replace('block text-2xl font-black text-gray-900', 'text-gray-900')

# Tabs
tabs_regex = re.compile(r'<!-- Modern Tabs -->.*?<div class="flex flex-wrap justify-center gap-2 mb-10 p-1\.5 bg-white rounded-2xl shadow-sm border border-gray-100 mx-auto w-fit">', re.DOTALL)
old_tabs = """<!-- Tabs (Instagram Style) -->
    <div class="flex justify-center gap-6 md:gap-12 border-t border-gray-200 mt-4">"""
content = tabs_regex.sub(old_tabs, content)

# Tab buttons
content = re.sub(r":class=\"\['flex items-center gap-2 px-5 py-2\.5 text-sm font-bold rounded-xl transition-all duration-300',\s*currentTab === '([^']+)' \? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'\]\"",
                 r":class=\"['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors', currentTab === '\1' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']\"", content)

# Content area wrappers
content = content.replace('<!-- Content Area -->\n      <div class="relative">', '<!-- Content Area -->\n      <div class="mt-8">')
content = content.replace('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', 'grid grid-cols-3 gap-1 md:gap-4')

# Card styles
content = content.replace("'bg-white rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl relative aspect-square',", "'relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer',")
content = content.replace("selectionMode && selectedPhotos.includes(purchase.photoId) ? 'ring-4 ring-indigo-500 ring-offset-2' : 'border border-gray-100 hover:border-gray-200 hover:-translate-y-1'", "")

content = content.replace('bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative aspect-square', 'relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer opacity-80 hover:opacity-100')

with open('/Users/alejandroibarra/Desktop/Photos/moment-app/Front/pages/dashboard/customer/index.vue', 'w') as f:
    f.write(content)
