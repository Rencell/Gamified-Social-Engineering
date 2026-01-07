import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const authStoreMock = {
  User: {
    pk: 10,
    coin: 100,
    exp: 50,
  },
}
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authStoreMock,
}))

vi.mock('@/services', () => ({
  RewardService: {
    create_reward: vi.fn(),
  },
}))

import { RewardService } from '@/services'
import { useRewardStore } from '@/stores/reward'

describe('Reward store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    authStoreMock.User.pk = 10
    authStoreMock.User.coin = 100
    authStoreMock.User.exp = 50

    ;(RewardService.create_reward as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({ id: 1 })
  })

  it('increaseUserRewards calls create_reward and increments user coin/exp', async () => {
    const store = useRewardStore()

    await store.increaseUserRewards('content', 5, 7)

    expect(RewardService.create_reward).toHaveBeenCalledWith({
      action: 'increase',
      reason: 'content',
      coin: 5,
      xp: 7,
      user: 10,
    })

    expect(authStoreMock.User.coin).toBe(105)
    expect(authStoreMock.User.exp).toBe(57)
  })

  it('increaseUserRewards does not call service when coin is negative', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const store = useRewardStore()
    await store.increaseUserRewards('content', -1, 0)

    expect(RewardService.create_reward).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('decreaseUserRewards calls create_reward when coin is negative', async () => {
    const store = useRewardStore()

    await store.decreaseUserRewards('spend', -10, 0)

    expect(RewardService.create_reward).toHaveBeenCalledWith({
      action: 'decrease',
      reason: 'spend',
      coin: -10,
      xp: 0,
      user: 10,
    })

    expect(authStoreMock.User.coin).toBe(90)
    expect(authStoreMock.User.exp).toBe(50)
  })

  it('decreaseUserRewards does not call service when coin is positive', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const store = useRewardStore()
    await store.decreaseUserRewards('spend', 10, 0)

    expect(RewardService.create_reward).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('calculateScore returns 0 for invalid inputs', () => {
    const store = useRewardStore()

    expect(store.calculateScore(10, 0)).toEqual({ coin: 0, exp: 0 })
    expect(store.calculateScore(6, 5)).toEqual({ coin: 0, exp: 0 })
  })

  it('calculateScore applies multipliers based on length', () => {
    const store = useRewardStore()

    // length <= 3 => 1.2 multiplier
    // baseScore = floor((3/3)*10)=10; adjusted=floor(10*1.2)=12 => coin=24 exp=48
    expect(store.calculateScore(3, 3)).toEqual({ coin: 24, exp: 48 })

    // length <= 5 => 1.5 multiplier
    // baseScore = floor((5/5)*10)=10; adjusted=floor(10*1.5)=15 => coin=30 exp=60
    expect(store.calculateScore(5, 5)).toEqual({ coin: 30, exp: 60 })

    // length > 5 => 1.0 multiplier
    // baseScore = floor((6/10)*10)=6; adjusted=6 => coin=12 exp=24
    expect(store.calculateScore(6, 10)).toEqual({ coin: 12, exp: 24 })
  })

  it('purchaseCoinDeduct calls decreaseUserRewards with negative coin amount', async () => {
    const store = useRewardStore()

    await store.purchaseCoinDeduct(25)

    await vi.waitFor(() => {
      expect(RewardService.create_reward).toHaveBeenCalledWith({
        action: 'decrease',
        reason: store.REASONS.spend,
        coin: -25,
        xp: 0,
        user: 10,
      })
    })
  })
})
