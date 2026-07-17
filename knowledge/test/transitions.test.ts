import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isTransitionAllowed, isTransitionAllowedForActor } from '../schema/transitions.ts';
import * as transitionsModule from '../schema/transitions.ts';

describe('transitions', () => {
  it('rejeita transição direta draft -> validated', () => {
    assert.equal(isTransitionAllowed('draft', 'validated'), false);
  });

  it('nega qualquer agente de IA promover uma entrada para validated', () => {
    assert.equal(isTransitionAllowedForActor('under_review', 'validated', 'agent'), false);
    assert.equal(isTransitionAllowedForActor('under_review', 'validated', 'system'), false);
  });

  it('exige actorType human para under_review -> validated', () => {
    assert.equal(isTransitionAllowedForActor('under_review', 'validated', 'human'), true);
  });

  it('permite draft -> under_review e qualquer estado -> blocked', () => {
    assert.equal(isTransitionAllowed('draft', 'under_review'), true);
    assert.equal(isTransitionAllowed('draft', 'blocked'), true);
    assert.equal(isTransitionAllowed('under_review', 'blocked'), true);
    assert.equal(isTransitionAllowed('validated', 'blocked'), true);
  });

  it('permite blocked -> draft para reabrir o ciclo', () => {
    assert.equal(isTransitionAllowed('blocked', 'draft'), true);
    assert.equal(isTransitionAllowed('blocked', 'validated'), false);
  });

  it('nunca expõe uma função que efetua a transição para validated', () => {
    const forbidden = [
      'setValidated',
      'approveAsValidated',
      'autoValidate',
      'validateWithAI',
      'promoteToValidated',
    ];
    for (const name of forbidden) {
      assert.equal(name in transitionsModule, false, `função proibida encontrada: ${name}`);
    }
  });
});
