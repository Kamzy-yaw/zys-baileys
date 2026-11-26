
import { generateWAMessageContent } from './lib/Utils/messages.js'
import { proto } from './WAProto/index.js'

const tests = [
    {
        name: 'richResponse',
        content: {
            richResponse: [
                { text: 'Testing Rich Response' },
                {
                    language: 'javascript',
                    code: [
                        { highlightType: 1, codeContent: 'const' },
                        { highlightType: 0, codeContent: ' x = 10' }
                    ]
                }
            ]
        }
    },
    {
        name: 'code',
        content: {
            headerText: 'JavaScript Example',
            code: 'const message = "Hello World"',
            language: 'javascript'
        }
    },
    {
        name: 'table',
        content: {
            headerText: 'Feature Comparison',
            title: 'Test Table',
            table: [
                ['Feature', 'Status'],
                ['Rich Response', 'OK'],
                ['Code Block', 'OK']
            ]
        }
    },
    {
        name: 'links',
        content: {
            headerText: 'Useful Links',
            links: [
                {
                    text: 'Documentation',
                    url: 'https://example.com',
                    title: 'Example Documentation',
                    displayName: 'Example'
                }
            ]
        }
    }
]

let passed = 0

for (const test of tests) {
    console.log(`\nTesting: ${test.name}`)

    const result = await generateWAMessageContent(test.content, {})

    const rich =
        result.botForwardedMessage?.message?.richResponseMessage

    if (!rich) {
        throw new Error(`${test.name}: Rich Response was not generated`)
    }

    const encoded = proto.Message.encode(result).finish()
    const decoded = proto.Message.decode(encoded)

    const decodedRich =
        decoded.botForwardedMessage?.message?.richResponseMessage

    if (!decodedRich) {
        throw new Error(`${test.name}: Protobuf round-trip failed`)
    }

    console.log('Generated:', true)
    console.log('Submessages:', rich.submessages.length)
    console.log('Protobuf:', true)

    passed++
}

console.log(`\n${passed}/${tests.length} compatibility tests passed!`)
