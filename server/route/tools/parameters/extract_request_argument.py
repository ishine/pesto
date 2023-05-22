from flask import Request
from typing import Union, List


def extract_request_argument(request: Request, argument_name: Union[str, List[str]]) -> Union[str, List[str], None]:
    # Assign arguments passed to the request to local variable
    arguments = request.args

    if isinstance(argument_name, str):
        # handle the case where argument_name is a string
        argument = arguments.get(argument_name, type=str)
        if argument == '':
            return None

        return argument
    elif isinstance(argument_name, list):
        # handle the case where argument_name is a list of strings
        requested_arguments = list()
        for name in argument_name:
            argument = arguments.get(name, type=str)

            requested_arguments.append(argument)

        return requested_arguments
