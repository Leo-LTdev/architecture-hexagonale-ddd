interface RepositoryInterface {
    ReadDb(): any;
    WriteDb(data: any): any;
}

export default RepositoryInterface;