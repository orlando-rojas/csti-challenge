module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3000/",
        "http://127.0.0.1:3000/products",
        "http://127.0.0.1:3000/products/1",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "resource-summary:script:size": ["warn", { maxNumericValue: 450000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
