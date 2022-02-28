import {camelCase} from "camel-case";
import {Method} from "./block_builder/UrlInput";
import {snakeCase} from "snake-case";

export const request_url = (baseName: string, apiEndpoint: string = "") => `
const ${snakeCase(baseName).toUpperCase()}_URL = "${apiEndpoint}";
`;

export const remotes_data_sources = (baseName: string) => `
  Future<${baseName}Response?> ${camelCase(baseName)}(${baseName}Payload payload);
`

export const remote_data_source_impl = (baseName: string, auth: boolean, method: Method) => `
  @override
  Future<${baseName}Response?> ${camelCase(baseName)}(${baseName}Payload payload) async{
    try {
      var headers = {"lang": get_current_locale()};${auth ? '\n' : ''}
      ${auth ? `String? token = await get_valide_access_token();\n
      if (token != null) {
        headers["Authorization"] = "Bearer " + token;
      }` : ''}
      var response =
          await dio.${method.toLowerCase()}(${snakeCase(baseName).toUpperCase()}_URL,
              ${method === 'GET' ? '' : 'data: json.encode(payload.toJson()),'}
              options: Options(headers: headers));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return ${baseName}Response.fromJson(response.data);
      } else {
        throw ServerException(
            response.statusCode ?? 400, "failed", response.data['message']);
      }
    } catch (error, trace) {
      print(error);
      print(trace);
      evaluateError(error);
    }
  }
`


export const repository_interface = (baseName: string) => `
  Future<Either<Failure, ${baseName}Response>> ${camelCase(baseName)}(${baseName}Payload payload);
`

export const repository_impl = (baseName: string) => `
  @override
  Future<Either<Failure, ${baseName}Response>> ${camelCase(baseName)}(${baseName}Payload payload) async {
    try {
      final result =
      await remoteDataSource.${camelCase(baseName)}(payload);

      return Right(result!);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.statusCode, e.errorCode, e.errorMessage));
    }
  }
`

export const use_case = (baseName: string, repository: string) => `
class ${baseName}UseCase implements UseCase<${baseName}Response, ${baseName}Payload> {
  
  final ${repository || 'Repository'} repository;

  ${baseName}UseCase(this.repository);

  @override
  Future<Either<Failure, ${baseName}Response?>> call(${baseName}Payload params) async {
    return await repository.${camelCase(baseName)}(params);
  }
}
`

export const block_usage = (baseName: string) => `

`