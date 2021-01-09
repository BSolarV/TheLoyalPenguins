module.exports = {
    port: process.env.PORT || 8080,
    watch: true,
    nodeResolve: true,
    appIndex: '/index.html',
    plugins: [],
    moduleDirs: ['node_modules', 'web_modules'],
};