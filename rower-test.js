import _ from 'underscore'
import rower from './rower'
import {expect} from 'chai'

describe('rower', () => {
  it('transforms empty array', () => {
    const rv = rower({
      results: [],
    })
    expect(rv).to.deep.equal([])
  })
  
  it('transforms one element array', () => {
    const rv = rower({
      results: [{width: 1}], image_fn: _.identity, container_width: 100, padding: 0,
    })
    expect(rv).to.deep.equal([[{width: 1}]])
  })
  
  it('transforms a huge element', () => {
    const rv = rower({
      results: [{width: 1000}], image_fn: _.identity, container_width: 100, padding: 0,
    })
    expect(rv).to.deep.equal([[{width: 1000}]])
  })
  
  it('transforms a huge element in a sequence', () => {
    const rv = rower({
      results: [
        {width: 10},
        {width: 1000},
        {width: 11},
      ], image_fn: _.identity, container_width: 100, padding: 0,
    })
    expect(rv).to.deep.equal([[{width: 10}], [{width: 1000}], [{width: 11}]])
  })
  
  it('combines elements into a row', () => {
    const rv = rower({
      results: [
        {width: 10},
        {width: 11},
        {width: 12},
      ], image_fn: _.identity, container_width: 100, padding: 0,
    })
    expect(rv).to.deep.equal([[{width: 10}, {width: 11}, {width: 12}]])
  })
  
  it('overflows correctly after combining', () => {
    const rv = rower({
      results: [
        {width: 10},
        {width: 11},
        {width: 80},
        {width: 10},
      ], image_fn: _.identity, container_width: 100, padding: 0,
    })
    expect(rv).to.deep.equal([[{width: 10}, {width: 11}], [{width: 80}, {width: 10}]])
  })
})
