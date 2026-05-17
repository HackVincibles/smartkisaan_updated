const fs = require('fs');
const path = require('path');

const applyThemeFixes = (dirPath) => {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      applyThemeFixes(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We only want to apply this to standard UI components, skip layouts/configs if needed
      // Actually, applying class replacements universally is fine.
      let originalContent = content;

      // Ensure useColorScheme is imported if we are using isDark for icons
      if (!content.includes("useColorScheme") && content.includes("lucide-react-native") && content.includes("export default")) {
         if (!content.includes("import { useColorScheme }")) {
             content = content.replace("import React", "import React from 'react';\nimport { useColorScheme } from 'nativewind';\n//");
         }
         
         // Insert const { colorScheme } = useColorScheme(); const isDark = colorScheme === 'dark'; into component
         // This is tricky via regex, so we'll just fix standard tailwind class replacements
      }

      // Root background
      content = content.replace(/bg-background/g, 'bg-gray-50 dark:bg-zinc-950');
      
      // Text colors
      content = content.replace(/text-on-surface-variant/g, 'text-gray-500 dark:text-zinc-400');
      content = content.replace(/text-on-surface/g, 'text-gray-900 dark:text-zinc-100');
      
      // Borders
      content = content.replace(/border-outline-variant/g, 'border-gray-200 dark:border-zinc-800');
      
      // Surface containers (Cards)
      content = content.replace(/bg-white/g, 'bg-white dark:bg-zinc-900');
      content = content.replace(/bg-surface-container/g, 'bg-gray-100 dark:bg-zinc-800/50');
      content = content.replace(/bg-inverse-surface/g, 'bg-gray-900 dark:bg-zinc-100');
      content = content.replace(/text-inverse-on-surface/g, 'text-white dark:text-zinc-900');
      content = content.replace(/border-inverse-surface/g, 'border-gray-900 dark:border-zinc-100');
      
      // Spacing overrides (px-margin -> px-4)
      content = content.replace(/px-margin/g, 'px-4');
      content = content.replace(/mx-margin/g, 'mx-4');
      content = content.replace(/mt-md/g, 'mt-4');
      content = content.replace(/mt-lg/g, 'mt-6');
      content = content.replace(/mt-xl/g, 'mt-8');
      content = content.replace(/mb-md/g, 'mb-4');
      content = content.replace(/mb-lg/g, 'mb-6');
      content = content.replace(/mb-xl/g, 'mb-8');
      content = content.replace(/p-md/g, 'p-4');
      content = content.replace(/p-lg/g, 'p-6');
      content = content.replace(/py-sm/g, 'py-2');
      content = content.replace(/px-sm/g, 'px-2');
      content = content.replace(/px-md/g, 'px-4');
      content = content.replace(/py-md/g, 'py-4');
      content = content.replace(/mr-md/g, 'mr-4');
      content = content.replace(/mr-sm/g, 'mr-2');
      content = content.replace(/ml-md/g, 'ml-4');
      content = content.replace(/ml-sm/g, 'ml-2');
      content = content.replace(/gap-md/g, 'gap-4');
      content = content.replace(/gap-sm/g, 'gap-2');
      
      // Typography overrides
      content = content.replace(/text-headline-md/g, 'text-xl');
      content = content.replace(/text-headline-lg/g, 'text-2xl');
      content = content.replace(/text-body-lg/g, 'text-lg');
      content = content.replace(/text-body-md/g, 'text-base');
      content = content.replace(/text-label-md/g, 'text-sm');
      content = content.replace(/text-label-sm/g, 'text-xs');

      // Specifically find the Header row in dashboards to make it cylindrical
      content = content.replace(
        /<View className="px-4 flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-800">/g, 
        '<View className="px-4 py-4 bg-white dark:bg-zinc-900 mx-2 mt-2 rounded-[40px] shadow-sm flex-row justify-between items-center border border-gray-100 dark:border-zinc-800">'
      );
      content = content.replace(
        /<View className="px-4 flex-row justify-between items-center py-2">/g, 
        '<View className="px-4 py-4 bg-white dark:bg-zinc-900 mx-2 mt-2 rounded-[40px] shadow-sm flex-row justify-between items-center border border-gray-100 dark:border-zinc-800">'
      );
      
      // Fix background dark mode overrides that might be broken by bg-white -> dark:bg-zinc-900
      // like bg-[#0f172a] shouldn't be affected because it's hardcoded.

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated theme for ${fullPath}`);
      }
    }
  });
};

applyThemeFixes('/home/pineapple/Desktop/smartkissan/client/stitch-expo-demo/app');
