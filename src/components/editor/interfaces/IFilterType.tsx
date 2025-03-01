/*
const filterTypes = {
  byDate: {
    name: "Datum",
    byName: "Podle data",
    filter: (a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  },
  bySize: {
    name: "Velikost",
    byName: "Podle velikosti",
    filter: (a: any, b: any) => b.size - a.size,
  },
  byId: {
    name: "ID",
    byName: "Podle ID",
    filter: (a: any, b: any) => b.id - a.id,
  },
};
*/

export default interface IFilterType {
  name: string;
  byName: string;
  description: string;
  filter: (a: any, b: any) => any;
}
