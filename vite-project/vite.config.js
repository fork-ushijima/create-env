import { defineConfig } from "vite";
import path from "path";
import globule from "globule"
import vitePluginPugStatic from "@macropygia/vite-plugin-pug-static";
import imageminPlugin from 'vite-plugin-imagemin';
import browserslistToEsbuild from "browserslist-to-esbuild";


const inputs = {};
const documents = globule.find([`./src/**/*.html`, `./src/**/*.pug`], {
  ignore: [`./src/html/**/_*.html`, `./src/pug/**/_*.pug`],
});
documents.forEach((document) => {
  const fileName = document.replace(`./src/`, "");
  const key = path.parse(document).name;
  inputs[key] = path.resolve(__dirname, "src", fileName);
});

export default defineConfig({
  root: "src",
  server: {
    host: true,
    port: 3000
  },
  publicDir: "../public",
  build: {
    outDir:"../dist", //プロジェクトルートからの相対パス(index.pugからの相対パス)
    emptyOutDir: true, //ビルド時の警告を防ぐ
    target: browserslistToEsbuild(),
    minify: false,
    rollupOptions: {
      input: { ...inputs },
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          if (/\.(gif|jpeg|jpg|png|svg|webp)$/.test(assetInfo.name)) {
            return `assets/images/[name].[ext]`;
          }
          if (/\.css$/.test(assetInfo.name)) {
            return `assets/css/[name].[ext]`;
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  plugins: [
    vitePluginPugStatic({
      buildOptions: { basedir: "src" },//ルートディレクトリ
      serveOptions: { basedir: "src" }//ルートディレクトリ
    }),
    imageminPlugin({
      gifsicle: {
        interlaced: true,
      },
      optipng: null,
      mozjpeg: {
        quality: 90,
      },
      pngquant: {
        quality: [0.9, 0.9],
        speed: 1,
        floyd: 0,
      },
      svgo: false,
    })
  ]
})