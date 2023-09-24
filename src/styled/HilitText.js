const HilitText = ({ value, values = [], children }) => {
  const param = values.find(
    (str) => children.toLowerCase().indexOf(str.toLowerCase()) > -1
  );
  const str = param || value;

  const parts = children.split(new RegExp(str, "ig"));
  return (
    <>
      {/* [{JSON.stringify(values)}] */}
      {parts.reduce((out, res, i) => {
        if (!(i < parts.length - 1)) return out.concat(res);
        return out.concat(res, <b style={{ color: "red" }}>{str}</b>);
      }, [])}
    </>
  );
};
export default HilitText;
