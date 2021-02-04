import React, { useCallback, useEffect } from "react"

import { Gitgraph } from "@gitgraph/react"
import { GitgraphOptions, Orientation } from "@gitgraph/core"

import { useSteps } from '@mdx-deck/gatsby-plugin'


const options: GitgraphOptions = { "author": "mike" }
const initalOptions = { 'subject': 'Initial commit', 'hash': '11854cf' }
const commit1 = { 'subject': 'Make it work', 'hash': '3109572' }
const commit2 = { 'subject': 'other work', 'hash': '8a8e6e8' }
const commit3 = { 'subject': 'fixes', 'hash': '8a8e6e9' }
const commit4 = { 'subject': 'PR changes', 'hash': '8a8e6ea' }
const squashCommit = { 'subject': 'Squashed commits', 'hash': '4adf433' }


const makeTree = (gitgraph) => {
    const master = gitgraph.branch("master")
    master.commit(initalOptions)


    const branch = master.branch("a-feature")
    branch.commit(commit1)
    branch.commit(commit2)
    branch.commit(commit3)
    branch.commit(commit4)
    return { master, branch }
}

const PreMerge = ({ additionalOptions = {} }: { additionalOptions?: GitgraphOptions }) =>
    <Gitgraph options={{ ...options, ...additionalOptions }}>
        {makeTree}
    </Gitgraph>

const NoSquash = ({ step, additionalOptions = {} }: { step: number, additionalOptions?: GitgraphOptions }) => {
    const graph = useCallback(gitgraph => {
        const { master, branch } = makeTree(gitgraph)

        if (step >= 1) {
            master.merge({ branch, fastForward: false, commitOptions: { subject: 'Merge branch a-feature', hash: 'ac0d773'} })
        }
    }, [step])

    return <Gitgraph options={{ ...options, ...additionalOptions }}>
        {graph}
    </Gitgraph>
}

const Squash = ({ step, additionalOptions = {} }: { step: number, additionalOptions?: GitgraphOptions }) => {
    const graph = useCallback(gitgraph => {
        if (step == 0) {
            makeTree(gitgraph)
        } else {
            const master = gitgraph.branch("master")
            master.commit(initalOptions)

            const branch = master.branch("a-feature")
            branch.commit(squashCommit)
            master.merge({ branch, fastForward: false })
        }
    }, [step])

    return <Gitgraph options={{ ...options, ...additionalOptions }}>
        {graph}
    </Gitgraph>
}

const Example = () => {
    const step = useSteps(4)

    const Container = useCallback(() => <div style={{ 'width': '100%', 'display': 'grid', 'gridTemplateRows': '20% 20% 60%', 'gridTemplateColumns': '50% 50%' }}>
        <div style={{ 'gridArea': '1 / 1 / span 1 / span 2' }}>
            <PreMerge additionalOptions={{ 'orientation': Orientation.Horizontal }} />
        </div>
        <div style={{ 'gridArea': '2 / 1 / span 1 / span 1', 'visibility': step >= 1 ? 'visible' : 'hidden' }}>
            <h1>Without Squash</h1>
        </div>
        <div style={{ 'gridArea': '3 / 1 / span 1 / span 1', 'visibility': step >= 1 ? 'visible' : 'hidden' }}>
            <NoSquash step={step - 1} />
        </div>
        <div style={{ 'gridColumn': '2 / 2 / span 1 / span 1', 'visibility': step >= 3 ? 'visible' : 'hidden' }}>
            <h1>With Squash</h1>
        </div>
        <div style={{ 'gridColumn': '3 / 2 / span 1 / span 1', 'visibility': step >= 3 ? 'visible' : 'hidden' }}>
            <Squash step={step - 3} />
        </div>

    </div>, [step]
    )

    return <Container />
}

export default Example
