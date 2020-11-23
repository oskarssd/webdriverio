import { getPidPath } from '../src/utils'
import { getValue, setValue, setPort } from '../src/client'
import SharedStoreService from '../src/service'

jest.mock('../src/client', () => ({
    getValue: jest.fn(),
    setValue: jest.fn(),
    setPort: jest.fn(),
}))
jest.mock('../src/utils', () => ({
    readFile: () => 44444,
    getPidPath: jest.fn(),
}))

describe('SharedStoreService', () => {
    let storeService: SharedStoreService

    beforeEach(() => {
        const browser = { call: (fn: Function) => fn() }
        storeService = new SharedStoreService({}, [], {}, browser)
    })

    it('beforeSession', async () => {
        await storeService.beforeSession()
        expect(getPidPath).toBeCalledWith(process.ppid)
        expect(setPort).toBeCalledWith('44444')
    })

    it('beforeSession', () => {
        storeService.before()
        storeService['_browser'].sharedStore.get('foobar')
        storeService['_browser'].sharedStore.set('foo', 'bar')
        expect(getValue).toBeCalledWith('foobar')
        expect(setValue).toBeCalledWith('foo', 'bar')
    })

    afterEach(() => {
        (getPidPath as jest.Mock).mockClear()
        ;(setPort as jest.Mock).mockClear()
        ;(getValue as jest.Mock).mockClear()
        ;(setValue as jest.Mock).mockClear()
    })
})
