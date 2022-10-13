import path from "path";
export default {
    mode: "development",
    entry: {
        app: "./build/app.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve("public/js")
    }
};
