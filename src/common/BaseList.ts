import { Vue } from 'vue-property-decorator';

export default abstract class BaseList extends Vue {
  protected loading: boolean = false;
  protected list: any[] = [];
  protected pageNo: number = 1;
  protected pageSize: number = 10;
  protected total: number = 0;

  protected abstract getListImpl();

  protected async getList() {
    try {
      this.loading = true;
      const { list, total } = await this.getListImpl();
      this.list = list;
      this.total = total;
    } finally {
      this.loading = false;
    }
  }

  protected changePageNo(pageNo) {
    this.pageNo = pageNo;
    this.getList();
  }

  protected changePageSize(pageSize) {
    this.pageNo = 1;
    this.pageSize = pageSize;
    this.getList();
  }
}
