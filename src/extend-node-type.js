import unified from 'unified'
import parse from 'rehype-parse'
import u from 'unist-builder'
import visit from 'unist-util-visit'
import toHtml from 'hast-util-to-html'
import { selectAll } from 'unist-util-select'

export function parseHtml(html = '') {
  return unified()
    .use(parse, { emitParseErrors: true, duplicateAttribute: true })
    .parse(html)
}

const createSpotifyIframe = (
  node,
  url,
  { width = '100%', height = 400 } = {}
) => {
  if (
    /https:\/\/open\.spotify\.com\/((user\/[A-Za-z0-9-_]*\/playlist|track|artist|album)|(playlist|track|artist|album))\/[A-Za-z0-9-_?=]*/.test(
      url
    )
  ) {
    const spotifyURL = url
      .replace('https://open.spotify.com', 'https://open.spotify.com/embed')
      .split('?')[0]

    node.type = 'element'
    node.children = []
    node.properties = {
      width,
      height,
      frameBorder: '0',
      allowTransparency: 'true',
      allow: 'encrypted-media',
      src: spotifyURL
    }
    node.tagName = 'iframe'
  }
}

export function replaceSpotifyLinks(htmlAST) {
  visit(htmlAST, 'text', node => {
    const { value } = node
    createSpotifyIframe(node, value)
  })

  visit(htmlAST, 'element', node => {
    const {
      properties: { href }
    } = node
    createSpotifyIframe(node, href)
  })

  return htmlAST
}

const createYoutubeResponsiveIframe = (
  node,
  { width = '100%', height = 400 } = {}
) => {
  if (/youtube/.test(node.properties.src)) {
    const oldNode = node
    node.type = 'element'
    node.children = [
      u(oldNode.type, {
        tagName: oldNode.tagName,
        properties: oldNode.properties
      })
    ]
    node.properties = {
      class: 'youtube-container'
    }
    node.tagName = 'div'
  }
}

export function replaceYoutubeIframe(htmlAST) {
  const nodes = selectAll('element[tagName="iframe"]', htmlAST)
  nodes.map(node => createYoutubeResponsiveIframe(node))
  return htmlAST
}

function parseAndTransform({ rssNode }) {
  const content = rssNode.content.encoded
  const htmlAST = parseHtml(content)
  const newAst = replaceYoutubeIframe(replaceSpotifyLinks(htmlAST))
  return toHtml(newAst)
}

export default function(
  {
    type,
    basePath,
    getNode,
    getNodesByType,
    cache,
    getCache: possibleGetCache,
    reporter,
    ...rest
  },
  pluginOptions
) {
  if (type.name !== `Feed${pluginOptions.name}`) {
    return {}
  }
  return new Promise((resolve, reject) => {
    return resolve({
      html: {
        type: `String`,
        resolve(rssNode) {
          return getHTML(rssNode)
        }
      }
    })
  })

  async function getHTML(rssNode) {
    const newHtml = parseAndTransform({ rssNode })
    return newHtml
  }
}
