import { despaced } from "./despaced";

export const getPagination = (
  collection,
  { page = 1, pageSize, sortkey, sortDir }
) => {
  const pageCount = Math.ceil(collection?.length / pageSize);
  const startNum = (page - 1) * pageSize;

  const index = sortDir * -1;

  const sorted = !sortkey
    ? collection
    : collection?.sort((a, b) =>
        despaced(a[sortkey]) > despaced(b[sortkey]) ? index : sortDir
      );

  const visible = sorted?.slice(startNum, startNum + pageSize);

  return {
    totalCount: collection.length,
    startNum,
    pageCount,
    visible,
  };
};
