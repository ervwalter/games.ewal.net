﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace GamesCacheUpdater
{
	public static class ExtensionMethods
	{

		public static decimal? SingleDecimalPlace(this decimal? value)
		{
			if (value.HasValue)
			{
				return Math.Round(value.Value, 1);
			}
			else
			{
				return value;
			}
		}

		public static T As<T>(this XElement element, T defaultValue = default(T), params string[] alternateNulls)
		{
			if (element == null)
			{
				return defaultValue;
			}

			var value = (element.Value ?? "").Trim();

			if (value == "")
			{
				return defaultValue;
			}

			if (alternateNulls != null && alternateNulls.Length > 0)
			{
				if (alternateNulls.Contains(value, StringComparer.InvariantCultureIgnoreCase))
				{
					return defaultValue;
				}
			}

			if (typeof(T) == typeof(string))
			{
				return (T)((object)value);
			}

			try
			{
				return GetValue<T>(value);
			}
			catch
			{
				return defaultValue;
			}
		}

		public static T AttributeAs<T>(this XElement element, string attribute, T defaultValue = default(T), params string[] alternateNulls)
		{
			if (element == null)
			{
				return defaultValue;
			}

			var xatt = element.Attribute(attribute);
			if (xatt == null)
			{
				return defaultValue;
			}

			var value = (xatt.Value ?? "").Trim();

			if (alternateNulls != null && alternateNulls.Length > 0)
			{
				if (alternateNulls.Contains(value, StringComparer.InvariantCultureIgnoreCase))
				{
					return defaultValue;
				}
			}

			if (typeof(T) == typeof(string))
			{
				return (T)((object)value);
			}

			try
			{
				return GetValue<T>(value);
			}
			catch
			{
				return defaultValue;
			}
		}

		private static T GetValue<T>(string value)
		{
			Type t = typeof(T);
			t = Nullable.GetUnderlyingType(t) ?? t;
			if (value == null || DBNull.Value.Equals(value))
			{
				return default(T);
			}
			return (T)Convert.ChangeType(value, t);
		}

		public static bool AsBool(this int value)
		{
			return value == 1;
		}

		public static DateTime GetBuildDate(this Assembly assembly)
		{
			const string BuildVersionMetadataPrefix = "+build";

			var attribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();
			if (attribute?.InformationalVersion != null)
			{
				var value = attribute.InformationalVersion;
				var index = value.IndexOf(BuildVersionMetadataPrefix);
				if (index > 0)
				{
					value = value.Substring(index + BuildVersionMetadataPrefix.Length);
					if (DateTime.TryParseExact(value, "yyyyMMddHHmmss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
					{
						return result;
					}
				}
			}

			return default;
		}

	}
}
