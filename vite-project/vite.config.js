import { defineConfig } from "vite";
import sassGlobImports from 'vite-plugin-sass-glob-import';
// import path from "path";
import globule from "globule"
import vitePluginPugStatic from "@macropygia/vite-plugin-pug-static";
import imageminPlugin from 'vite-plugin-imagemin';
import browserslistToEsbuild from "browserslist-to-esbuild";

const htmlFiles = globule.find('src/**/*.pug', {
  ignore: [
    'src/**/_*.pug',
  ]
});
// const inputs = {};
// const documents = globule.find([`./src/**/*.pug`, `./src/**/*.scss`], {
//   ignore: [`./src/**/_*.pug`, `./src/**/_*.scss`],
// });
// documents.forEach((document) => {
//   const fileName = document.replace(`./src/`, "");
//   const key = path.parse(document).name;
//   inputs[key] = path.resolve(__dirname, "src", fileName);
// });

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir:"../html", //プロジェクトルートからの相対パス(index.pugからの相対パス)
    emptyOutDir: true, //ビルド時の警告を防ぐ
    target: browserslistToEsbuild(),
    cssCodeSplit: true,
    rollupOptions: {
      input: htmlFiles,
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          //let extType = path.extname(assetInfo.name);
          if (/\.(gif|jpeg|jpg|png|svg|webp)$/.test(assetInfo.name)) {
            return `assets/images/[name][extname]`;
          }
          //ビルド時のCSS名を明記してコントロールする
          if(extType === 'scss' || extType === 'css') {
            console.log(assetInfo.originalFileName, assetInfo.names);
            return `assets/css/[name][extname]`;
          }
          return 'assets/[name][extname]';
        },
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
      }
    }
  },
  plugins: [
    sassGlobImports(),
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