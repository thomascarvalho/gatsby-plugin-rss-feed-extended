# gatsby-plugin-rss-feed-extended

Parse html feed content
 - transform spotify links to embeded players
 - add a parent div with class='youtube-container' to iframe youtube embeded

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
          resolve: `@dikalikatao/gatsby-plugin-rss-feed-extended`,
          options: {
            name: `RssFeedName`, // same name as above
          }
        },
    ...
```