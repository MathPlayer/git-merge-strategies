import React, { useCallback } from "react"

import { Gitgraph } from "@gitgraph/react"
import { GitgraphOptions } from "@gitgraph/core"

import { useSteps } from '@mdx-deck/gatsby-plugin'


const options: GitgraphOptions = { "author": "mike" }
const initalOptions = { 'subject': 'Initial commit', 'hash': '11854cf' }
const commit1 = { 'subject': 'Make it work', 'hash': '3109572' }
const commit2 = { 'subject': 'other work', 'hash': '8a8e6e8' }
const commit3 = { 'subject': 'fixes', 'hash': '8a8e6e9' }
const commit4 = { 'subject': 'PR changes', 'hash': '8a8e6ea' }
const masterCommit1 = { 'subject': 'unrelated changes', 'hash': '17356da' }

const Rebase = ({ step }: { step: number }) => {

    const graph = useCallback(gitgraph => {
        const master = gitgraph.branch("master")
        master.commit(initalOptions)
        console.log('BLAH ' + step)

        if (step == 0) {
            const branch = master.branch("a-feature")
            branch.commit(commit1)
            branch.commit(commit2)
            branch.commit(commit3)
            branch.commit(commit4)
        } else if (step == 1) {
            const branch = master.branch("a-feature")
            branch.commit(commit1)
            branch.commit(commit2)
            branch.commit(commit3)
            branch.commit(commit4)
            master.commit(masterCommit1)
        } else if (step == 2) {
            master.commit(masterCommit1)
            const branch = master.branch("a-feature")
            branch.commit(commit1)
            branch.commit(commit2)
            branch.commit(commit3)
            branch.commit(commit4)
        } else {
            master.commit(masterCommit1)
            master.commit(commit1)
            master.commit(commit2)
            master.commit(commit3)
            master.commit(commit4)
        }
    }, [step])

    return <Gitgraph options={{ ...options }}>
        {graph}
    </Gitgraph>
}

const Example = () => {
    const step = useSteps(3)

    const Container = useCallback(() => <Rebase step={step} />, [step]
    )

    return <Container />
}

export default Example
