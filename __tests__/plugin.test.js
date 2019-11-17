import u from 'unist-builder'
import { selectAll } from 'unist-util-select'

import {
  parseHtml,
  replaceSpotifyLinks,
  replaceYoutubeIframe
} from '../src/extend-node-type'

test('parse html', () => {
  const html = '<h3>Title</h3><p>Paragraph</p>'
  const expected = u(
    'root',
    {
      data: {
        quirksMode: true
      },
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0
        },
        end: {
          column: 31,
          line: 1,
          offset: 30
        }
      }
    },
    [
      u('element', { tagName: 'html', properties: {} }, [
        u('element', { tagName: 'head', properties: {} }, []),
        u('element', { tagName: 'body', properties: {} }, [
          u(
            'element',
            {
              tagName: 'h3',
              properties: {},
              position: {
                start: {
                  column: 1,
                  line: 1,
                  offset: 0
                },
                end: {
                  column: 15,
                  line: 1,
                  offset: 14
                }
              }
            },
            [
              u('text', {
                value: 'Title',
                position: {
                  start: {
                    column: 5,
                    line: 1,
                    offset: 4
                  },
                  end: {
                    column: 10,
                    line: 1,
                    offset: 9
                  }
                }
              })
            ]
          ),
          u(
            'element',
            {
              tagName: 'p',
              properties: {},
              position: {
                start: {
                  column: 15,
                  line: 1,
                  offset: 14
                },
                end: {
                  column: 31,
                  line: 1,
                  offset: 30
                }
              }
            },
            [
              u('text', {
                value: 'Paragraph',
                position: {
                  start: {
                    column: 18,
                    line: 1,
                    offset: 17
                  },
                  end: {
                    column: 27,
                    line: 1,
                    offset: 26
                  }
                }
              })
            ]
          )
        ])
      ])
    ]
  )
  // console.log(JSON.stringify(expected))
  expect(parseHtml(html)).toStrictEqual(expected)
})

test('transform spotify playlist link', () => {
  const html =
    '<p>Bla bla bla</p><p><a href="https://open.spotify.com/playlist/5xBSULUmT3aDwUe0htVNWE?si=0-UsQKzqRiiQx-sYosyQBwaz">love, a playlist by TC on Spotify</a></p><p>Bla bla bla</p>'

  const ast = parseHtml(html)
  const newAST = replaceSpotifyLinks(ast)

  const iframes = selectAll('element[tagName="iframe"]', newAST)

  expect(iframes).toHaveLength(1)
  expect(iframes[0]).toStrictEqual(
    u('element', {
      tagName: 'iframe',
      properties: {
        width: '100%',
        height: 400,
        frameBorder: '0',
        allowTransparency: 'true',
        allow: 'encrypted-media',
        src: 'https://open.spotify.com/embed/playlist/5xBSULUmT3aDwUe0htVNWE'
      },
      children: [],
      position: {
        start: {
          column: 22,
          line: 1,
          offset: 21
        },
        end: {
          column: 154,
          line: 1,
          offset: 153
        }
      }
    })
  )
})

test('transform youtube iframe', () => {
  const html =
    '<p>Bla bla bla</p><iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F4gKwlH0RBto%3Ffeature%3Doembed&amp;url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D4gKwlH0RBto&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4gKwlH0RBto%2Fhqdefault.jpg&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=youtube" width="854" height="480" frameborder="0" scrolling="no">&#x3C;a href="https://medium.com/media/f6344dc4ba5789fdb02e882849991a90/href">https://medium.com/media/f6344dc4ba5789fdb02e882849991a90/href&#x3C;/a></iframe><p>Bla bla bla</p>'

  const ast = parseHtml(html)
  const newAST = replaceYoutubeIframe(ast)

  console.log(JSON.stringify(newAST))
})
