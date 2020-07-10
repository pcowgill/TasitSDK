module.exports = {
  title: "Tasit",
  tagline: "A JavaScript / TypeScript SDK for building native mobile Ethereum dapps with React Native",
  url: "https://docs.tasit.io",
  baseUrl: "/",
  favicon: "img/favicon-32x32.png",
  organizationName: "tasitlabs", // Usually your GitHub org/user name.
  projectName: "tasit", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Tasit",
      logo: {
        alt: "Tasit logo",
        src: "img/TasitLogoSvg.svg",
      },
      links: [
        { to: "docs/introduction", label: "Docs", position: "left" },
        {
          href: "https://github.com/tasitlabs/tasit-sdk",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Tech",
          items: [
            {
              label: "Docs",
              to: "docs/introduction",
            },
            {
              label: "Roadmap",
              href: "https://github.com/orgs/tasitlabs/projects/1",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Telegram",
              href: "https://t.me/tasitproject",
            },
            {
              label: "Discord",
              href: "https://discord.gg/bRp4QKq",
            },
            {
              label: "Feature requests",
              href: "http://feedback.tasit.io/feature-requests",
            },
          ],
        },
        {
          title: "Social",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/TasitProject",
            },
            {
              label: "Medium",
              href: "https://medium.com/tasit",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tasit Labs`,
    },
    // algolia: {
    //   apiKey: process.env.REACT_APP_API_KEY,
    //   indexName: process.env.REACT_APP_INDEX_NAME
    // }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            'https://github.com/tasitlabs/tasit-sdk/tree/develop/packages/docs',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
