# gatsby-plugin-rss-feed-extended

This plugin requires `gatsby-source-rss-feed`

Use this plugin with and declare it after

gatsby-config.js
```
    ...
    {
          resolve: `gatsby-source-rss-feed`,
          options: {
            url: `https://rss-feed-url.com/`,
            name: `RssFeedName`,
          }
        },
        {
          resolve: `@thomascarvalho/gatsby-plugin-rss-feed-extended`,
          options: {
            name: `RssFeedName`, // same name as above
          }
        },
    ...
```