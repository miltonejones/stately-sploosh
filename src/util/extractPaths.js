export default function extractPaths(obj, currentPath = [], paths = []) {
  Object.keys(obj).forEach((key) => {
    const newPath = currentPath.concat(key);
    if (typeof obj[key] === "object" && obj[key] !== null) {
      extractPaths(obj[key], newPath, paths);
    } else {
      paths.push(newPath.join("."));
    }
  });
  return paths;
}
