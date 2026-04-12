using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Domain.Abstractions;

public interface IEntityTypeRegistry
{
    Type GetClrType(string name);
    string GetPrimaryKeyName(Type type);
    Type GetPrimaryKeyType(Type type);
}
