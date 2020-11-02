const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy } = require('customize-cra');

module.exports = override(
    addDecoratorsLegacy(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#FC8732',
        //     '@link-color':'#FC492A',
        //     '@switch-color':'#25b864',
        //     },
    }),
);

//// '@primary-color': '#FBA339'


// const { injectBabelPlugin } = require('react-app-rewired');
// const rewireLess = require('react-app-rewire-less');
// module.exports = function override(config, env) {
//     config = rewireLess.withLoaderOptions({
//         modifyVars: { "@primary-color": "#9F35FF" },
//     })(config, env);
//     return config;
// }