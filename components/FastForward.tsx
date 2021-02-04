import React, { useCallback } from "react"

import { Gitgraph } from "@gitgraph/react"
import { GitgraphOptions, Orientation } from "@gitgraph/core"

import { useSteps } from '@mdx-deck/gatsby-plugin'

const options: GitgraphOptions = { "author": "mike" }
const initalOptions = { 'subject': 'Initial commit', 'hash': '11854cf' }
const workOptions = { 'subject': 'Make it work', 'hash': '3109572' }
const otherWorkOptions = { 'subject': 'other work', 'hash': '8a8e6e8' }

const makeTree = (gitgraph) => {
    const master = gitgraph.branch("master")
    master.commit(initalOptions)


    const branch = master.branch("a-feature")
    branch.commit(workOptions)
    return { master, branch }
}

const FastForward = ({ step, additionalOptions = {} }: { step: number, additionalOptions?: GitgraphOptions }) =>
    <Gitgraph options={{ ...options, ...additionalOptions }}>
        {(gitgraph) => {
            console.log('FastForward ' + step)
            const { master, branch } = makeTree(gitgraph)

            if (step >= 1) {
                master.merge({ branch, fastForward: true })
            }
        }}
    </Gitgraph>

const NoFastForward = ({ step, additionalOptions = {} }: { step: number, additionalOptions?: GitgraphOptions }) =>
    <Gitgraph options={{ ...options, ...additionalOptions }}>
        {(gitgraph) => {
            console.log('NoFastForward ' + step)
            const { master, branch } = makeTree(gitgraph)

            if (step >= 1) {
                master.merge({ branch, fastForward: false })
            }
        }}
    </Gitgraph>

const NoFastForwardConflict = ({ step, additionalOptions = {} }: { step: number, additionalOptions?: GitgraphOptions }) =>
    <Gitgraph options={{ ...options, ...additionalOptions }}>
        {(gitgraph) => {
            console.log('NoFastForwardConflict ' + step)
            const { master, branch } = makeTree(gitgraph)
            master.commit(otherWorkOptions)

            if (step >= 1) {
                master.merge({ branch, fastForward: false })
            }
        }}
    </Gitgraph>

export const FastVsNoFastForwardExamples = () => {
    const step = useSteps(2)

    const container = (<div style={{ 'display': 'grid', 'height': '80%', 'width': '100%', 'gridTemplateRows': '20% 80%', 'gridTemplateColumns': '50% 50%', 'justifyItems': 'center', 'alignItems': 'stretch' }}>
        <div style={{ 'gridArea': '1 / 1 / span 1 / span 1', 'visibility': step >= 1 ? 'visible' : 'hidden' }}>
            <h1>Fast forward merge</h1>
        </div>
        <div style={{ 'gridArea': '2 / 1 / span 1 / span 1', 'visibility': step >= 1 ? 'visible' : 'hidden' }}>
            <FastForward additionalOptions={{ "orientation": Orientation.VerticalReverse }} step={2} />
        </div>
        <div style={{ 'gridColumn': '1 / 2 / span 1 / span 1', 'visibility': step >= 2 ? 'visible' : 'hidden' }}>
            <h1>No fast forward merge</h1>
        </div>
        <div style={{ 'gridColumn': '2 / 2 / span 1 / span 1', 'visibility': step >= 2 ? 'visible' : 'hidden' }}>
            <NoFastForward additionalOptions={{ "orientation": Orientation.VerticalReverse }} step={2} />
        </div>

    </div>
    )

    return <React.Fragment>{container}</React.Fragment>
}

const ConflictExample = ({ other, noOther }: { other: React.FunctionComponent<{ step: number }>, noOther: React.FunctionComponent<{ step: number }> }) => {
    const step = useSteps(3)

    const Container = useCallback(() => (<div style={{ 'width': '100%', 'display': 'grid', 'gridTemplateRows': '30% 70%', 'gridTemplateColumns': '50% 50%', 'justifyItems': 'center', 'alignItems': 'center' }}>
        <div style={{ 'gridArea': '1 / 1 / span 1 / span 1' }}>
            <h1>No other work merged</h1>
        </div>
        <div style={{ 'gridArea': '2 / 1 / span 1 / span 1' }}>
            {noOther({ step })}
        </div>
        <div style={{ 'gridColumn': '1 / 2 / span 1 / span 1', 'visibility': step >= 2 ? 'visible' : 'hidden' }}>
            <h1>Other work merged</h1>
        </div>
        <div style={{ 'gridColumn': '2 / 2 / span 1 / span 1', 'visibility': step >= 2 ? 'visible' : 'hidden' }}>
            {other({ step: step - 2 })}
        </div>
    </div>
    ), [step])

    return <Container />
}

export const FastForwardExamples = () =>
    <ConflictExample
        noOther={({ step }: { step: number }) => <FastForward step={step} />}
        other={({ step }: { step: number }) => { return step == 0 ? <NoFastForwardConflict step={step} /> : <h1 style={{ 'color': 'red' }}>REJECTED</h1>}}
    />

export const NoFastForwardExamples = () =>
    <ConflictExample
        noOther={({ step }: { step: number }) => <NoFastForward step={step} />}
        other={({ step }: { step: number }) => <NoFastForwardConflict step={step} />}
    />
