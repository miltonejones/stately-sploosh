 

const HilitText = ({ value, children }) => {
  const parts = children.split(new RegExp(value, "ig"));
  return (
    <>
      {parts.reduce((out, res, i) => {
        if (!(i < parts.length - 1)) return out.concat(res);
        return out.concat(res, <b style={{ color: "red" }}>{value}</b>);
      }, [])}
    </>
  );
};
export default HilitText;
