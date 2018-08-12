import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('PaginagedAll', () => {
  class User extends Model {
    static basename = 'user';

    static async paginated(page, metaCallback: Function) {
      const { data } = await this.api.http.get(`${this.pluralPath}?page=${page}`);
      metaCallback(data.meta);
      return this.makeArray(data.users);
    }

    normalizeName(name) {
      return name.toLowerCase();
    }
  }

  const axiosAdapter = new MockAdapter(User.api.http);

  afterEach(() => {
    axiosAdapter.reset();
  });

  it('finds all models', async () => {
    axiosAdapter.onGet('users?page=1').reply(200, {
      users: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],
      meta: { current_page: 1, total_pages: 2 }
    });

    axiosAdapter.onGet('users?page=2').reply(200, {
      users: [{ id: 3, name: 'Bob Vence' }, { id: 2, name: 'Vence Refrigeration' }],
      meta: { current_page: 2, total_pages: 2 }
    });

    const metaFn = jest.fn();

    const firstPageUsers = await User.paginated(1, metaFn);
    expect(firstPageUsers.length).toEqual(2);
    expect(firstPageUsers[0]).toBeInstanceOf(User);
    expect(firstPageUsers).toEqual([{ id: 1, name: 'john doe' }, { id: 2, name: 'jane doe' }]);
    expect(metaFn).toHaveBeenCalledWith({ current_page: 1, total_pages: 2 });

    const secondPageUsers = await User.paginated(2, metaFn);
    expect(secondPageUsers.length).toEqual(2);
    expect(secondPageUsers[0]).toBeInstanceOf(User);
    expect(secondPageUsers).toEqual([{ id: 3, name: 'bob vence' }, { id: 2, name: 'vence refrigeration' }]);
    expect(metaFn).toHaveBeenCalledWith({ current_page: 2, total_pages: 2 });
  });
});
