# Pin npm packages by running ./bin/importmap

pin "application"

pin "daisyui" # @5.0.27
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

pin "@tailwindcss/forms", to: "@tailwindcss--forms.js" # @0.5.10

pin "@tailwindcss/colors", to: "tailwindcss--colors.js" # @4.1.4
pin "@tailwindcss/defaultTheme", to: "tailwindcss--defaultTheme.js" # @4.1.4
pin "@tailwindcss/typography", to: "@tailwindcss--typography.js" # @0.5.16
pin_all_from "app/javascript/controllers", under: "controllers"
pin "tailwindcss/plugin", to: "tailwindcss--plugin.js" # @4.1.4
pin "cssesc" # @3.0.0
pin "lodash.castarray" # @4.4.0
pin "lodash.isplainobject" # @4.0.6
pin "lodash.merge" # @4.6.2
pin "postcss-selector-parser" # @6.0.10
pin "tailwindcss/colors", to: "tailwindcss--colors.js" # @4.1.4
pin "util-deprecate" # @1.0.2
pin "mini-svg-data-uri" # @1.4.4
pin "tailwindcss/defaultTheme", to: "tailwindcss--defaultTheme.js" # @4.1.4
pin "theme-change" # @2.5.0
pin "idiomorph" # @2.1.0
