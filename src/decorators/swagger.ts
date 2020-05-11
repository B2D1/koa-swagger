export const getDocs = (target: any) =>
  (target.docs = target.docs || {
    swagger: '2.0',
    tags: [],
    paths: {},
    info: { description: 'Swagger文档', version: '1.0.0', title: 'Koa-server' },
  });

export const Host = (host: string) => {
  return (target: any) => {
    const docs = getDocs(target.prototype);
    docs.host = host;
  };
};

export const Tag = (tag: string, desc: string) => {
  return (target: any) => {
    const docs = getDocs(target.prototype);
    docs.tags.push({
      name: tag,
      description: desc,
    });
  };
};
