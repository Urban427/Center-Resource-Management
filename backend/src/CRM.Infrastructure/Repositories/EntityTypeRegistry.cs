using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRM.Domain.Abstractions;
using CRM.Domain.Entities;
namespace CRM.Infrastructure.Repositories;

public class EntityTypeRegistry: IEntityTypeRegistry
{
    private readonly Dictionary<string, Type> _map = new()
    {
        ["Booking"] = typeof(Booking),
        ["Device"] = typeof(Device),
        ["DeviceType"] = typeof(DeviceType)
    };

    public Type GetClrType(string name)
        => _map.TryGetValue(name, out var type)
            ? type
            : throw new Exception("Unknown type");

    public string GetPrimaryKeyName(Type type) => "Id";

    public Type GetPrimaryKeyType(Type type)
    {
        var key = type.GetProperties().FirstOrDefault(p => p.Name == "Id");
        if (key == null) throw new Exception($"No Id key on {type.Name}");
        return key.PropertyType;
    }
}
