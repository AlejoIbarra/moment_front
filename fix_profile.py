import re

with open('/Users/alejandroibarra/.gemini/antigravity-ide/brain/4a002dcf-c40f-4578-b3d1-f85c9eb658e3/scratch/old_profile.vue', 'r') as f:
    old_content = f.read()

with open('/Users/alejandroibarra/Desktop/Photos/moment-app/Front/pages/profile/[username].vue', 'r') as f:
    current_content = f.read()

# Extract <template> from old_content
old_template = re.search(r'<template>.*?</template>', old_content, re.DOTALL).group(0)

# Replace <template> in current_content
new_content = re.sub(r'<template>.*?</template>', old_template, current_content, count=1, flags=re.DOTALL)

with open('/Users/alejandroibarra/Desktop/Photos/moment-app/Front/pages/profile/[username].vue', 'w') as f:
    f.write(new_content)
